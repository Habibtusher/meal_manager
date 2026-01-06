import prisma from '@/lib/prisma';
import { cache } from 'react';

export const getWalletData = cache(async (
    organizationId: string, 
    startDate: Date, 
    endDate: Date, 
    skip = 0, 
    take = 10,
    searchQuery?: string
) => {
    const whereClause = {
        organizationId,
        createdAt: {
            gte: startDate,
            lte: endDate
        },
        ...(searchQuery ? {
            OR: [
                { description: { contains: searchQuery, mode: 'insensitive' as const } },
                { user: { name: { contains: searchQuery, mode: 'insensitive' as const } } },
            ]
        } : {})
    };

    const [totalCount, transactions, members, stats] = await Promise.all([
        prisma.walletTransaction.count({ where: whereClause }),
        prisma.walletTransaction.findMany({
            where: whereClause,
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            include: { user: { select: { name: true, email: true } } },
            skip,
            take,
        }),
        prisma.user.findMany({
            where: { organizationId, role: { in: ['MEMBER', 'ADMIN'] }, isActive: true },
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' },
        }),
        prisma.$transaction([
            prisma.walletTransaction.aggregate({
                where: { organizationId, type: 'CREDIT', createdAt: { gte: startDate, lte: endDate } },
                _sum: { amount: true }
            }),
            prisma.user.aggregate({
                where: { organizationId },
                _sum: { walletBalance: true }
            })
        ])
    ]);

    return {
        totalCount,
        transactions,
        members,
        totalDeposits: stats[0]._sum.amount || 0,
        systemLiability: stats[1]._sum.walletBalance || 0,
    };
});
