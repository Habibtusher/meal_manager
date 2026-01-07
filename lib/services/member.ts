import prisma from '@/lib/prisma';
import { getRemainingBalance } from '@/lib/calculations';
import { cache } from 'react';

export const getMemberDashboardStats = cache(async (userId: string, organizationId: string, month: number, year: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const [
        userBalance,
        orgStats,
        userStats
    ] = await Promise.all([
        getRemainingBalance(userId),
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
            })
        ]),
        prisma.mealRecord.aggregate({
            where: {
                userId,
                status: 'CONFIRMED',
                date: { gte: startDate, lte: endDate }
            },
            _sum: { count: true }
        })
    ]);

    const totalOrgExpenses = orgStats[0]._sum.amount || 0;
    const totalOrgMeals = orgStats[1]._sum.count || 0;
    const userTotalMeals = userStats._sum.count || 0;

    const mealRate = totalOrgMeals > 0 ? totalOrgExpenses / totalOrgMeals : 0;
    const monthlyCost = userTotalMeals * mealRate;

    return {
        userBalance,
        userTotalMeals,
        mealRate,
        monthlyCost
    };
});
