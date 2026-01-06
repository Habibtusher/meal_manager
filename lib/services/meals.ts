import prisma from '@/lib/prisma';
import { cache } from 'react';

export const getAttendanceData = cache(async (organizationId: string, date: Date) => {
    const [members, confirmedRecords] = await Promise.all([
        prisma.user.findMany({
            where: { organizationId, role: { in: ['MEMBER', 'ADMIN'] }, isActive: true },
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' },
        }),
        prisma.mealRecord.findMany({
            where: {
                date,
                user: { organizationId },
                status: 'CONFIRMED'
            },
            select: {
                userId: true,
                mealType: true,
                count: true
            }
        })
    ]);

    const initialCounts = confirmedRecords.map((r) => ({
        userId: r.userId,
        mealType: r.mealType,
        count: r.count
    }));

    return {
        members,
        initialCounts
    };
});
