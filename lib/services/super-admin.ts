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
        (prisma as any).supportTicket.count(),
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
