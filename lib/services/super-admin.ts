import prisma from '@/lib/prisma';
import { cache } from 'react';

export const getPlatformStats = cache(async () => {
    const [
        orgCount,
        userCount,
        mealCount,
        ticketCount
    ] = await Promise.all([
        prisma.organization.count(),
        prisma.user.count(),
        prisma.mealRecord.count(),
        prisma.supportTicket.count(),
    ]);

    return {
        orgCount,
        userCount,
        mealCount,
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
    return prisma.organization.findMany({
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
});

