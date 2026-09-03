import prisma from '@/lib/prisma';
import { cache } from 'react';

export const getPlatformStats = cache(async () => {
    const [
        orgCount,
        userCount,
        mealAggregate,
        ticketCount
    ] = await Promise.all([
        prisma.organization.count(),
        prisma.user.count(),
        prisma.mealRecord.aggregate({
            where: { status: { not: 'CANCELLED' } },
            _sum: { count: true }
        }),
        prisma.supportTicket.count(),
    ]);

    return {
        orgCount,
        userCount,
        mealCount: mealAggregate._sum.count ?? 0,
        ticketCount
    };
});

export const getRecentOrganizations = cache(async (take = 5) => {
    return prisma.organization.findMany({
        take,
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { users: true }
            }
        }
    });
});

export const getAllOrganizations = cache(async () => {
    const organizations = await prisma.organization.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: {
                    users: true,
                    mealSchedules: true,
                    expenses: true,
                    walletTransactions: true,
                }
            },
            users: {
                where: { role: 'ADMIN' },
                select: {
                    id: true,
                    name: true,
                    email: true
                },
                take: 1
            }
        }
    });

    const orgsWithMeals = await Promise.all(
        organizations.map(async (org) => {
            const mealAgg = await prisma.mealRecord.aggregate({
                where: {
                    user: { organizationId: org.id },
                    status: { not: 'CANCELLED' }
                },
                _sum: {
                    count: true
                }
            });

            return {
                ...org,
                totalMeals: mealAgg._sum.count ?? 0,
            };
        })
    );

    return orgsWithMeals;
});

export const getAllSupportTickets = cache(async () => {
    return prisma.supportTicket.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                        }
                    }
                }
            }
        }
    });
});

export const getUserSupportTickets = cache(async (userId: string) => {
    return prisma.supportTicket.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    });
});


