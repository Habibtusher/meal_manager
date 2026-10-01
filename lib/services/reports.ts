import prisma from '@/lib/prisma';
import { cache } from 'react';

export const getOrganizationReports = cache(async (organizationId: string, startDate: Date, endDate: Date) => {
    const month = startDate.getUTCMonth() + 1;
    const year = startDate.getUTCFullYear();

    const [expenses, members, settlement] = await Promise.all([
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
        }) as unknown as any,
        prisma.monthSettlement.findUnique({
            where: {
                organizationId_month_year: {
                    organizationId,
                    month,
                    year
                }
            },
            include: {
                memberSettlements: true
            }
        })
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
        
        // Build individual shared cost details
        const sharedCostDetails = member.sharedCostAllocations.map((alloc: any) => ({
            description: alloc.sharedCost.description,
            category: alloc.sharedCost.category,
            amount: Number(alloc.amount),
            date: alloc.sharedCost.date
        }));
        
        const totalCost = totalMealCost + totalSharedCost;
        const credits = member.walletTransactions
            .filter((t: any) => t.type === 'CREDIT')
            .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
        const debits = member.walletTransactions
            .filter((t: any) => t.type === 'DEBIT')
            .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
        const totalDeposited = credits - debits;

        const memberSettlementRecord = settlement?.memberSettlements?.find((s: any) => s.userId === member.id);

        return {
            id: member.id,
            name: member.name,
            isActive: member.isActive,
            mealsConsumed,
            totalMealCost,
            totalSharedCost,
            sharedCostDetails,
            totalCost,
            totalDeposited,
            adjustedBalance: totalDeposited - totalCost,
            currentBalance: Number(member.walletBalance),
            settlementRecord: memberSettlementRecord || null
        };
    });

    return {
        totalExpenses,
        totalMeals,
        mealRate,
        reportData,
        memberCount: members.length,
        isSettled: !!settlement,
        settlement
    };
});
