import prisma from '@/lib/prisma';
import { cache } from 'react';

export const getMemberMealHistory = cache(async (userId: string, organizationId: string, startDate: Date, endDate: Date) => {
    const [records, orgStats] = await Promise.all([
        prisma.mealRecord.findMany({
            where: {
                userId,
                status: 'CONFIRMED',
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        }),
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
        ])
    ]);

    const totalOrgExpenses = orgStats[0]._sum.amount || 0;
    const totalOrgMeals = orgStats[1]._sum.count || 0;
    const mealRate = totalOrgMeals > 0 ? totalOrgExpenses / totalOrgMeals : 0;

    return {
        records,
        mealRate
    };
});
