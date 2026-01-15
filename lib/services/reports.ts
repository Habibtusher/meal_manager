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
                },
                // @ts-ignore: Stale Prisma types
                sharedCostAllocations: {
                    where: {
                        sharedCost: {
                            date: {
                                gte: startDate,
                                lte: endDate
                            }
                        }
                    },
                    include: {
                        sharedCost: true
                    }
                }
            }
        }) as unknown as any
    ]);

    const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0);
    const totalMeals = members.reduce((sum: number, member: any) =>
        sum + member.mealRecords.reduce((mSum: number, r: any) => mSum + (r.count || 0), 0), 0
    );

    const mealRate = totalMeals > 0 ? totalExpenses / totalMeals : 0;

    const reportData = members.map((member: any) => {
        const mealsConsumed = member.mealRecords.reduce((sum: number, r: any) => sum + (r.count || 0), 0);
        const totalMealCost = mealsConsumed * mealRate;
        // @ts-ignore: Stale Prisma types
        const totalSharedCost = member.sharedCostAllocations.reduce((sum: number, alloc: any) => sum + Number(alloc.amount), 0);
        const totalCost = totalMealCost + totalSharedCost;
        const totalDeposited = member.walletTransactions.reduce((sum: number, t: any) => sum + Number(t.amount), 0);

        return {
            id: member.id,
            name: member.name,
            mealsConsumed,
            totalMealCost,
            totalSharedCost,
            totalCost,
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
