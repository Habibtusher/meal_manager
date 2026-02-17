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

    const [totalCount, transactions, members] = await Promise.all([
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
    ]);

    const stats = await prisma.$transaction([
        prisma.walletTransaction.aggregate({
            where: { organizationId, type: 'CREDIT', createdAt: { gte: startDate, lte: endDate } },
            _sum: { amount: true }
        }),
        prisma.user.aggregate({
            where: { organizationId },
            _sum: { walletBalance: true }
        }),
        prisma.walletTransaction.aggregate({
            where: { organizationId, type: 'DEBIT', createdAt: { gte: startDate, lte: endDate } },
            _sum: { amount: true }
        })
    ]);

    const totalDeposits = stats[0]._sum.amount || 0;
    const systemLiability = stats[1]._sum.walletBalance || 0;
    const totalExpenses = stats[2]._sum.amount || 0;

    // Separate calculation for newer transactions to keep query simple
    let newerCredits = 0;
    let newerDebits = 0;

    if (transactions.length > 0) {
        const newerStats = await prisma.$transaction([
            prisma.walletTransaction.aggregate({
                where: {
                    organizationId,
                    type: 'CREDIT',
                    createdAt: { gte: startDate, lte: endDate },
                    OR: [
                        { createdAt: { gt: transactions[0].createdAt } },
                        { createdAt: transactions[0].createdAt, id: { gt: transactions[0].id } }
                    ]
                },
                _sum: { amount: true }
            }),
            prisma.walletTransaction.aggregate({
                where: {
                    organizationId,
                    type: 'DEBIT',
                    createdAt: { gte: startDate, lte: endDate },
                    OR: [
                        { createdAt: { gt: transactions[0].createdAt } },
                        { createdAt: transactions[0].createdAt, id: { gt: transactions[0].id } }
                    ]
                },
                _sum: { amount: true }
            })
        ]);
        newerCredits = newerStats[0]._sum.amount || 0;
        newerDebits = newerStats[1]._sum.amount || 0;
    }

    return {
        totalCount,
        transactions,
        members,
        totalDeposits,
        systemLiability,
        totalExpenses,
        netMonthlyChange: totalDeposits - totalExpenses,
        newerTransactionsSum: newerCredits - newerDebits
    };
});
