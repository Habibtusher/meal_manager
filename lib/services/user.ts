import prisma from '@/lib/prisma';
import { cache } from 'react';

export const getUserProfile = cache(async (userId: string) => {
    return prisma.user.findUnique({
        where: { id: userId },
        include: { organization: true },
    });
});
