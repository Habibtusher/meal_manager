'use server';

import { auth } from './auth';
import prisma from './prisma';
import { MealStatus, MealType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { deductMealCost, creditWallet } from './calculations';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Mark meal participation for a user
 */
export async function markParticipation(
  mealScheduleId: string,
  status: MealStatus
) {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.organizationId) {
    throw new Error('Unauthorized or invalid session');
  }

  const userId = session.user.id;
  const organizationId = session.user.organizationId;
  const schedule = await prisma.mealSchedule.findUnique({
    where: { id: mealScheduleId },
  });

  if (!schedule) throw new Error('Schedule not found');

  try {
    const existingRecord = await prisma.mealRecord.findUnique({
      where: {
        userId_mealScheduleId: {
          userId,
          mealScheduleId,
        },
      },
    });

    if (existingRecord) {
      // Update status
      await prisma.mealRecord.update({
        where: { id: existingRecord.id },
        data: { 
          status,
          markedBy: 'self'
        },
      });
    } else {
      // Create record
      await prisma.mealRecord.create({
        data: {
          userId,
          mealScheduleId,
          date: schedule.date,
          mealType: schedule.mealType,
          status,
          markedBy: 'self'
        },
      });
    }

    // If confirmed, no longer deduct cost automatically because price is manual/rate-based now
    // if (status === 'CONFIRMED') {
    //   await deductMealCost(userId, mealScheduleId, organizationId);
    // }

    revalidatePath('/member/dashboard');
    revalidatePath('/admin/attendance');
    return { success: true };
  } catch (error) {
    console.error('Failed to mark participation:', error);
    return { success: false, error: 'Failed to update record' };
  }
}

/**
 * Admin: Batch mark attendance for a specific date using granular counts (0, 0.5, 1) per meal
 */
export async function batchMarkAttendance(
  date: Date,
  records: { userId: string; mealType: MealType; count: number }[]
) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

  const organizationId = session.user.organizationId;
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  try {
    // Optimization: Ensure all needed schedules exist efficiently
    const distinctTypes = Array.from(new Set(records.map(r => r.mealType)));

    await prisma.$transaction(async (tx:any) => {
      // 1. Fetch existing schedules for this date
      const existingSchedules = await tx.mealSchedule.findMany({
        where: {
          organizationId,
          date: startOfDay,
          mealType: { in: distinctTypes },
        },
      });

      const scheduleMap = new Map<MealType, string>();
      existingSchedules.forEach((s:any) => scheduleMap.set(s.mealType, s.id));

      // 2. Create missing schedules
      for (const type of distinctTypes) {
        if (!scheduleMap.has(type)) {
          const newSchedule = await tx.mealSchedule.create({
            data: {
              organizationId,
              date: startOfDay,
              mealType: type,
              menu: 'Regular Meal',
              price: 0,
            },
          });
          scheduleMap.set(type, newSchedule.id);
        }
      }

      // 3. Process records with known schedule IDs
      for (const record of records) {
        const scheduleId = scheduleMap.get(record.mealType);
        if (!scheduleId) continue;

        // Upsert meal record with explicit count
        await (tx.mealRecord as any).upsert({
          where: {
            userId_mealScheduleId: {
              userId: record.userId,
              mealScheduleId: scheduleId,
            },
          },
          update: {
            count: record.count,
            status: record.count > 0 ? 'CONFIRMED' : 'CANCELLED',
            markedBy: 'admin',
          },
          create: {
            userId: record.userId,
            mealScheduleId: scheduleId,
            date: startOfDay,
            mealType: record.mealType,
            count: record.count,
            status: record.count > 0 ? 'CONFIRMED' : 'CANCELLED',
            markedBy: 'admin',
          },
        });
      }
    }, {
      maxWait: 5000, // default: 2000
      timeout: 20000 // default: 5000
    });

    revalidatePath('/admin/meals');
    revalidatePath('/member/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to batch mark attendance:', error);
    return { success: false, error: 'Failed to update attendance' };
  }
}

/**
 * Admin: Add credit to user wallet
 */
export async function addWalletCredit(userId: string, amount: number, description: string, date: Date) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

  try {
    await creditWallet(userId, amount, description, session.user.organizationId, date);
    revalidatePath('/admin/wallet');
    revalidatePath('/admin/members');
    return { success: true };
  } catch (error) {
    console.error('Failed to add credit:', error);
    return { success: false, error: 'Failed to add credit' };
  }
}

/**
 * Admin: Create a new meal schedule
 */
export async function createMealSchedule(data: {
  date: Date;
  mealType: MealType;
  menu: string;
  price: number;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

  try {
    await prisma.mealSchedule.create({
      data: {
        ...data,
        organizationId: session.user.organizationId,
        price: data.price,
      },
    });
    revalidatePath('/admin/meals');
    return { success: true };
  } catch (error) {
    console.error('Failed to create schedule:', error);
    return { success: false, error: 'Failed to create schedule' };
  }
}

/**
 * Admin: Add an expense
 */
export async function addExpense(data: {
  date: Date;
  category: string;
  description: string;
  amount: number;
}) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

  try {
    await prisma.expense.create({
      data: {
        ...data,
        amount: data.amount,
        organizationId: session.user.organizationId,
      },
    });
    revalidatePath('/admin/expenses');
    return { success: true };
  } catch (error) {
    console.error('Failed to add expense:', error);
    return { success: false, error: 'Failed to add expense' };
  }
}

/**
 * Admin: Update an expense
 */
export async function updateExpense(id: string, data: {
  date: Date;
  category: string;
  description: string;
  amount: number;
}) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

  try {
    await prisma.expense.update({
      where: { id, organizationId: session.user.organizationId },
      data: {
        ...data,
        amount: data.amount,
      },
    });
    revalidatePath('/admin/expenses');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update expense:', error);
    return { success: false, error: error.message || 'Failed to update expense' };
  }
}

/**
 * Admin: Delete an expense
 */
export async function deleteExpense(id: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

  try {
    await prisma.expense.delete({
      where: { id, organizationId: session.user.organizationId },
    });
    revalidatePath('/admin/expenses');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete expense:', error);
    return { success: false, error: error.message || 'Failed to delete expense' };
  }
}

/**
 * Admin: Create a new member
 */
export async function createMember(data: {
  name: string;
  email: string;
}) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

  try {
    // Generate a default password for the new member
    const defaultPassword = 'Member@123'; // In a real app, this should be sent via email or changed on first login
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        organizationId: session.user.organizationId,
        role: 'MEMBER',
      },
    });

    revalidatePath('/admin/members');
    return { success: true, user: { id: user.id, email: user.email } };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'Email already exists' };
    }
    console.error('Failed to create member:', error);
    return { success: false, error: 'Failed to create member' };
  }
}

/**
 * Admin: Update member details
 */
export async function updateMember(userId: string, data: {
  name: string;
  email: string;
  isActive: boolean;
}) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

  try {
    // Ensure member belongs to the same organization
    const member = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: session.user.organizationId,
      },
    });

    if (!member) return { success: false, error: 'Member not found' };

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        isActive: data.isActive,
      },
    });

    revalidatePath('/admin/members');
    return { success: true };
  } catch (error) {
    console.error('Failed to update member:', error);
    return { success: false, error: 'Failed to update member' };
  }
}

/**
 * Admin: Delete a member
 */
export async function deleteMember(userId: string) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

  try {
    // Ensure member belongs to the same organization
    const member = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: session.user.organizationId,
      },
    });

    if (!member) return { success: false, error: 'Member not found' };

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin/members');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete member' };
  }
}

/**
 * Member: Update own profile
 */
export async function updateProfile(data: {
  name: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const userId = session.user.id;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
      },
    });

    revalidatePath('/member/profile');
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

/**
 * Member: Change password
 */
export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: 'Incorrect current password' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to change password:', error);
    return { success: false, error: 'Failed to change password' };
  }
}

/**
 * Admin: Update a wallet transaction
 */
export async function updateWalletTransaction(id: string, data: {
  amount: number;
  description: string;
  date: Date;
}) {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

  try {
    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.walletTransaction.findUnique({
        where: { id, organizationId: session.user.organizationId },
      });

      if (!transaction) throw new Error('Transaction not found');

      const user = await tx.user.findUnique({
        where: { id: transaction.userId },
        select: { walletBalance: true },
      });

      if (!user) throw new Error('User not found');

      const amountDiff = data.amount - transaction.amount;
      const newBalance = transaction.type === 'CREDIT' 
        ? user.walletBalance + amountDiff 
        : user.walletBalance - amountDiff;

      // Update transaction
      await tx.walletTransaction.update({
        where: { id },
        data: {
          amount: data.amount,
          description: data.description,
          createdAt: data.date,
          // Note: historically this makes balanceAfter inaccurate for this record if we don't update it,
          // but we prioritize current balance consistency.
          balanceAfter: transaction.type === 'CREDIT' 
            ? transaction.balanceAfter + amountDiff
            : transaction.balanceAfter - amountDiff
        },
      });

      // Update user balance
      await tx.user.update({
        where: { id: transaction.userId },
        data: { walletBalance: newBalance },
      });

      return { success: true, error: null };
    });

    revalidatePath('/admin/wallet');
    revalidatePath('/admin/members');
    return result as { success: boolean; error: string | null };
  } catch (error: any) {
    console.error('Failed to update transaction:', error);
    return { success: false, error: error.message || 'Failed to update transaction' };
  }
}

/**
 * Admin: Delete a wallet transaction
 */
export async function deleteWalletTransaction(id: string): Promise<{ success: boolean; error: string | null }> {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

  try {
    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.walletTransaction.findUnique({
        where: { id, organizationId: session.user.organizationId },
      });

      if (!transaction) throw new Error('Transaction not found');

      const user = await tx.user.findUnique({
        where: { id: transaction.userId },
        select: { walletBalance: true },
      });

      if (!user) throw new Error('User not found');

      // Revert the balance
      const newBalance = transaction.type === 'CREDIT'
        ? user.walletBalance - transaction.amount
        : user.walletBalance + transaction.amount;

      // Delete transaction
      await tx.walletTransaction.delete({
        where: { id },
      });

      // Update user balance
      await tx.user.update({
        where: { id: transaction.userId },
        data: { walletBalance: newBalance },
      });

      return { success: true, error: null };
    });

    revalidatePath('/admin/wallet');
    revalidatePath('/admin/members');
    return result as { success: boolean; error: string | null };
  } catch (error: any) {
    console.error('Failed to delete transaction:', error);
    return { success: false, error: error.message || 'Failed to delete transaction' };
  }
}
