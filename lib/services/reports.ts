import prisma from '@/lib/prisma';
import { cache } from 'react';

export const getOrganizationReports = cache(async (organizationId: string, startDate: Date, endDate: Date) => {
    const [expenses, members] = await Promise.all([
        prisma.expense.findMany({
            where: {
                organizationId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
        }),
        prisma.user.findMany({
            where: { organizationId, role: { in: ['MEMBER', 'ADMIN'] } },
            include: {
                mealRecords: {
                    where: {
                        status: 'CONFIRMED',
                        date: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                },
                walletTransactions: {
                    where: {
                        type: 'CREDIT',
                        createdAt: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                }
            }
        })
    ]);

    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const totalMeals = members.reduce((sum, member) =>
        sum + member.mealRecords.reduce((mSum, r) => mSum + (r.count || 0), 0), 0
    );

    const mealRate = totalMeals > 0 ? totalExpenses / totalMeals : 0;

    const reportData = members.map((member) => {
        const mealsConsumed = member.mealRecords.reduce((sum, r) => sum + (r.count || 0), 0);
        const totalMealCost = mealsConsumed * mealRate;
        const totalDeposited = member.walletTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

        return {
            id: member.id,
            name: member.name,
            mealsConsumed,
            totalMealCost,
            totalDeposited,
            currentBalance: Number(member.walletBalance)
        };
    });

    return {
        totalExpenses,
        totalMeals,
        mealRate,
        reportData,
        memberCount: members.length
    };
});
