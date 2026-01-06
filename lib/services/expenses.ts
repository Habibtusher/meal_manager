import prisma from '@/lib/prisma';
import { cache } from 'react';

export const getOrganizationExpenses = cache(async (
    organizationId: string, 
    startDate: Date, 
    endDate: Date, 
    skip = 0, 
    take = 10,
    searchQuery?: string
) => {
    const whereClause = {
        organizationId,
        date: { gte: startDate, lte: endDate },
        ...(searchQuery ? {
            OR: [
                { description: { contains: searchQuery, mode: 'insensitive' as const } },
                { category: { contains: searchQuery, mode: 'insensitive' as const } },
            ]
        } : {})
    };

    const [expenses, totalCount, stats] = await Promise.all([
        prisma.expense.findMany({
            where: whereClause,
            orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
            skip,
            take,
        }),
        prisma.expense.count({
            where: whereClause,
        }),
        prisma.expense.aggregate({
            where: whereClause,
            _sum: { amount: true },
        }),
    ]);

    return {
        expenses,
        totalCount,
        totalSpent: stats._sum.amount || 0,
    };
});
