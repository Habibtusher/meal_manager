import prisma from '@/lib/prisma';
import { getToday } from '@/lib/utils';
import { getMealParticipationStats, getLowBalanceUsers } from '@/lib/calculations';
import { cache } from 'react';

export const getAdminDashboardStats = cache(async (organizationId: string, month: number, year: number) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const [
        memberCount,
        participationStats,
        lowBalanceUsers,
        totalStats
    ] = await Promise.all([
        prisma.user.count({ 
            where: { 
                organizationId, 
                role: { in: ['MEMBER', 'ADMIN'] }, 
                isActive: true 
            } 
        }),
        getMealParticipationStats(organizationId, getToday()),
        getLowBalanceUsers(organizationId, 200),
        prisma.$transaction([
            prisma.expense.aggregate({
                where: {
                    organizationId,
                    date: { gte: startDate, lte: endDate }
                },
                _sum: { amount: true }
            }),
            prisma.mealRecord.aggregate({
                where: {
                    user: { organizationId },
                    status: 'CONFIRMED',
                    date: { gte: startDate, lte: endDate }
                },
                _sum: { count: true }
            }),
            prisma.walletTransaction.aggregate({
                where: {
                    organizationId,
                    type: 'CREDIT',
                    createdAt: { gte: startDate, lte: endDate }
                },
                _sum: { amount: true }
            })
        ])
    ]);

    const totalExpenses = totalStats[0]._sum.amount || 0;
    const totalMeals = totalStats[1]._sum.count || 0;
    const totalDeposits = totalStats[2]._sum.amount || 0;

    const availableBalance = totalDeposits - totalExpenses;
    const mealRate = totalMeals > 0 ? totalExpenses / totalMeals : 0;

    return {
        memberCount,
        participationStats,
        lowBalanceUsers,
        availableBalance,
        totalExpenses,
        totalMeals,
        mealRate
    };
});

export const getLatestExpenses = cache(async (organizationId: string, limit = 10) => {
    return prisma.expense.findMany({
        where: { organizationId },
        orderBy: { date: 'desc' },
        take: limit
    });
});
