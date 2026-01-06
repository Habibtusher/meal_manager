import prisma from '@/lib/prisma';
import { cache } from 'react';

export const getOrganizationMembers = cache(async (
    organizationId: string, 
    skip = 0, 
    take = 10,
    searchQuery?: string
) => {
    const whereClause = {
        organizationId,
        ...(searchQuery ? {
            OR: [
                { name: { contains: searchQuery, mode: 'insensitive' as const } },
                { email: { contains: searchQuery, mode: 'insensitive' as const } },
            ]
        } : {})
    };

    const [totalCount, members] = await Promise.all([
        prisma.user.count({ where: whereClause }),
        prisma.user.findMany({
            where: whereClause,
            orderBy: [{ role: 'asc' }, { name: 'asc' }],
            skip,
            take,
        })
    ]);

    return {
        totalCount,
        members,
    };
});
