'use server';

import prisma from '@/lib/prisma';

interface GetSharedCostsParams {
  organizationId: string;
  startDate: Date;
  endDate: Date;
  offset?: number;
  limit?: number;
  searchQuery?: string;
}

export async function getOrganizationSharedCosts({
  organizationId,
  startDate,
  endDate,
  offset = 0,
  limit = 10,
  searchQuery = ''
}: GetSharedCostsParams) {
  try {
    const where: any = {
      organizationId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (searchQuery) {
      where.OR = [
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { category: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const [sharedCosts, totalCount] = await Promise.all([
      // @ts-ignore: Stale Prisma types
      prisma.sharedCost.findMany({
        where,
        include: {
          allocations: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          }
        },
        orderBy: { date: 'desc' },
        skip: offset,
        take: limit,
      }),
      // @ts-ignore: Stale Prisma types
      prisma.sharedCost.count({ where }),
    ]);

    const totalSpent = await prisma.$queryRaw<[{ total: number }]>`
      SELECT COALESCE(SUM(amount), 0)::float as total
      FROM shared_costs
      WHERE "organizationId" = ${organizationId}
        AND date >= ${startDate}
        AND date <= ${endDate}
    `;

    return {
      sharedCosts,
      totalCount,
      totalSpent: totalSpent[0]?.total || 0,
    };
  } catch (error) {
    console.error('Failed to fetch shared costs:', error);
    return {
      sharedCosts: [],
      totalCount: 0,
      totalSpent: 0,
    };
  }
}
