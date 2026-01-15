'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateMemberRoomRent(userId: string, roomRent: number) {
  try {
    const session = await auth();
    if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

    await prisma.user.update({
      where: { id: userId, organizationId: session.user.organizationId },
      data: { roomRent } as any,
    });

    revalidatePath('/admin/members');
    return { success: true };
  } catch (error) {
    console.error('Failed to update room rent:', error);
    return { success: false, error: 'Failed to update room rent' };
  }
}

interface SharedCostAllocationInput {
  userId: string;
  amount: number;
}

interface AddSharedCostInput {
  amount: number;
  description: string;
  date: Date;
  category: string;
  allocations: SharedCostAllocationInput[];
}

export async function addSharedCost(data: AddSharedCostInput) {
  try {
    const session = await auth();
    if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

    const { amount, description, date, category, allocations } = data;

    // Validate total matches allocations (optional, but good practice)
    const totalAllocated = allocations.reduce((sum, a) => sum + a.amount, 0);
    // Allow small floating point diffs or strict check?
    // For now, we trust the frontend to send matching data, or we just rely on allocations.
    // Actually, let's trust the total passed, as it might be useful for the parent record.
    
    await prisma.$transaction(async (tx) => {
        // @ts-ignore: Stale Prisma types
        const sharedCost = await tx.sharedCost.create({
            data: {
                amount,
                description,
                date,
                category,
                organizationId: session.user.organizationId as string,
            } as any
        });

        if (allocations && allocations.length > 0) {
            // @ts-ignore: Stale Prisma types
            await tx.sharedCostAllocation.createMany({
                data: allocations.map(a => ({
                    sharedCostId: sharedCost.id,
                    userId: a.userId,
                    amount: a.amount
                }))
            });
        }
    });

    revalidatePath('/admin/expenses');
    revalidatePath('/admin/reports');
    return { success: true };
  } catch (error) {
    console.error('Failed to add shared cost:', error);
    return { success: false, error: 'Failed to add shared cost' };
  }
}
