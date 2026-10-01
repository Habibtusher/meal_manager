'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { TransactionType } from '@prisma/client';
import { sendMonthSettlementEmail } from '@/lib/email';

export interface MemberSettlementDecision {
  userId: string;
  isContinuing: boolean;
  actionTaken: 'CARRY_FORWARD' | 'REFUNDED' | 'DUE_PAID' | 'DUE_FORGIVEN' | 'BALANCED';
  actionAmount: number;
  notes?: string;
}

export interface CloseMonthInput {
  month: number;
  year: number;
  notes?: string;
  decisions: MemberSettlementDecision[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Checks if a date falls into a month that has been closed & settled
 */
export async function isMonthClosed(organizationId: string, date: Date): Promise<boolean> {
  const d = new Date(date);
  const month = d.getUTCMonth() + 1;
  const year = d.getUTCFullYear();

  const settlement = await prisma.monthSettlement.findUnique({
    where: {
      organizationId_month_year: {
        organizationId,
        month,
        year,
      },
    },
    select: { id: true, status: true },
  });

  return settlement?.status === 'CLOSED';
}

/**
 * Close and settle a month
 */
export async function closeAndSettleMonth(input: CloseMonthInput): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.organizationId || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized: Admin access required.' };
  }

  const { month, year, notes, decisions } = input;
  const organizationId = session.user.organizationId;
  const adminId = session.user.id;

  // 1. Check if already settled
  const existing = await prisma.monthSettlement.findUnique({
    where: {
      organizationId_month_year: {
        organizationId,
        month,
        year,
      },
    },
  });

  if (existing) {
    return { success: false, error: `Month ${MONTH_NAMES[month - 1]} ${year} is already closed and settled.` };
  }

  // 2. Calculate month date bounds
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  // Next month parameters for carry forward
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonthFirstDay = new Date(Date.UTC(nextYear, nextMonth - 1, 1, 0, 0, 1));
  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  try {
    // Fetch month statistics and organization details
    const [expenses, members, organization] = await Promise.all([
      prisma.expense.findMany({
        where: {
          organizationId,
          date: { gte: startDate, lte: endDate },
        },
      }),
      prisma.user.findMany({
        where: { organizationId, role: { in: ['MEMBER', 'ADMIN'] } },
        include: {
          mealRecords: {
            where: {
              status: 'CONFIRMED',
              date: { gte: startDate, lte: endDate },
            },
          },
          walletTransactions: {
            where: {
              createdAt: { gte: startDate, lte: endDate },
            },
          },
          sharedCostAllocations: {
            where: {
              sharedCost: {
                date: { gte: startDate, lte: endDate },
              },
            },
          },
        },
      }),
      prisma.organization.findUnique({
        where: { id: organizationId },
        select: { name: true },
      }),
    ]);

    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const totalMeals = members.reduce(
      (sum, m) => sum + m.mealRecords.reduce((mSum, r) => mSum + (r.count || 0), 0),
      0
    );
    const mealRate = totalMeals > 0 ? totalExpenses / totalMeals : 0;

    const emailJobs: Array<{
      name: string;
      email: string;
      organizationName: string;
      month: number;
      year: number;
      mealsConsumed: number;
      mealRate: number;
      totalMealCost: number;
      totalSharedCost: number;
      totalCost: number;
      totalDeposited: number;
      netBalance: number;
      isContinuing: boolean;
      actionTaken: string;
      notes?: string;
    }> = [];

    // Execute everything in a single atomic transaction
    await prisma.$transaction(async (tx) => {
      // 1. Create the MonthSettlement record
      const settlement = await tx.monthSettlement.create({
        data: {
          organizationId,
          month,
          year,
          status: 'CLOSED',
          totalExpenses,
          totalMeals,
          mealRate,
          closedById: adminId,
          notes: notes || null,
        },
      });

      // 2. Process each member
      for (const member of members) {
        const mealsConsumed = member.mealRecords.reduce((sum, r) => sum + (r.count || 0), 0);
        const totalMealCost = mealsConsumed * mealRate;
        const totalSharedCost = member.sharedCostAllocations.reduce((sum, alloc) => sum + Number(alloc.amount), 0);
        const totalCost = totalMealCost + totalSharedCost;

        const credits = member.walletTransactions
          .filter((t) => t.type === 'CREDIT')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const debits = member.walletTransactions
          .filter((t) => t.type === 'DEBIT')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const totalDeposited = credits - debits;
        const netBalance = totalDeposited - totalCost;

        // Find the decision for this member (or fallback to staying & carry forward)
        const decision = decisions.find((d) => d.userId === member.id);
        const isContinuing = decision ? decision.isContinuing : true;
        let actionTaken = decision?.actionTaken || (netBalance === 0 ? 'BALANCED' : 'CARRY_FORWARD');
        let actionAmount = decision?.actionAmount ?? Math.abs(netBalance);

        // A. Member is staying next month
        if (isContinuing) {
          if (netBalance > 0.01) {
            // Member has surplus -> Carry forward to next month as opening deposit (CREDIT)
            actionTaken = 'CARRY_FORWARD';
            const carryAmount = Math.round(netBalance * 100) / 100;
            const updatedUser = await tx.user.findUnique({
              where: { id: member.id },
              select: { walletBalance: true },
            });
            const newBal = (updatedUser?.walletBalance || 0) + carryAmount;

            await tx.walletTransaction.create({
              data: {
                userId: member.id,
                organizationId,
                type: TransactionType.CREDIT,
                amount: carryAmount,
                description: `Opening Balance (Carried over from ${monthLabel})`,
                balanceAfter: newBal,
                createdAt: nextMonthFirstDay,
              },
            });

            await tx.user.update({
              where: { id: member.id },
              data: { walletBalance: newBal },
            });
          } else if (netBalance < -0.01) {
            // Member has due -> Carry forward to next month as opening due (DEBIT)
            actionTaken = 'CARRY_FORWARD';
            const dueAmount = Math.round(Math.abs(netBalance) * 100) / 100;
            const updatedUser = await tx.user.findUnique({
              where: { id: member.id },
              select: { walletBalance: true },
            });
            const newBal = (updatedUser?.walletBalance || 0) - dueAmount;

            await tx.walletTransaction.create({
              data: {
                userId: member.id,
                organizationId,
                type: TransactionType.DEBIT,
                amount: dueAmount,
                description: `Opening Due (Carried over from ${monthLabel})`,
                balanceAfter: newBal,
                createdAt: nextMonthFirstDay,
              },
            });

            await tx.user.update({
              where: { id: member.id },
              data: { walletBalance: newBal },
            });
          } else {
            actionTaken = 'BALANCED';
          }
        } else {
          // B. Member is leaving the mess
          if (netBalance > 0.01) {
            // Surplus -> Refunded to member
            actionTaken = 'REFUNDED';
            const refundAmount = Math.round(netBalance * 100) / 100;
            const updatedUser = await tx.user.findUnique({
              where: { id: member.id },
              select: { walletBalance: true },
            });
            const newBal = (updatedUser?.walletBalance || 0) - refundAmount;

            await tx.walletTransaction.create({
              data: {
                userId: member.id,
                organizationId,
                type: TransactionType.DEBIT,
                amount: refundAmount,
                description: `Exit Refund (${monthLabel} Settlement)`,
                balanceAfter: newBal,
                createdAt: new Date(),
              },
            });

            await tx.user.update({
              where: { id: member.id },
              data: { walletBalance: newBal, isActive: false },
            });
          } else if (netBalance < -0.01) {
            // Due -> Paid or Forgiven
            if (actionTaken === 'DUE_PAID') {
              const paidAmount = Math.round(Math.abs(netBalance) * 100) / 100;
              const updatedUser = await tx.user.findUnique({
                where: { id: member.id },
                select: { walletBalance: true },
              });
              const newBal = (updatedUser?.walletBalance || 0) + paidAmount;

              await tx.walletTransaction.create({
                data: {
                  userId: member.id,
                  organizationId,
                  type: TransactionType.CREDIT,
                  amount: paidAmount,
                  description: `Exit Due Paid (${monthLabel} Settlement)`,
                  balanceAfter: newBal,
                  createdAt: new Date(),
                },
              });

              await tx.user.update({
                where: { id: member.id },
                data: { walletBalance: newBal, isActive: false },
              });
            } else {
              // DUE_FORGIVEN or other
              actionTaken = 'DUE_FORGIVEN';
              await tx.user.update({
                where: { id: member.id },
                data: { isActive: false },
              });
            }
          } else {
            // Balanced -> Just deactivate
            actionTaken = 'BALANCED';
            await tx.user.update({
              where: { id: member.id },
              data: { isActive: false },
            });
          }
        }

        // Save member settlement row
        await tx.memberSettlement.create({
          data: {
            settlementId: settlement.id,
            userId: member.id,
            mealsConsumed,
            totalMealCost,
            totalSharedCost,
            totalCost,
            totalDeposited,
            netBalance,
            actionTaken,
            actionAmount: Math.abs(actionAmount),
            isContinuing,
            notes: decision?.notes || null,
          },
        });

        // Queue settlement email job for this member
        if (member.email) {
          emailJobs.push({
            name: member.name,
            email: member.email,
            organizationName: organization?.name || 'Meal Manager',
            month,
            year,
            mealsConsumed,
            mealRate,
            totalMealCost,
            totalSharedCost,
            totalCost,
            totalDeposited,
            netBalance,
            isContinuing,
            actionTaken,
            notes: decision?.notes || notes || undefined,
          });
        }
      }
    });

    // Dispatch settlement statement emails to all members asynchronously
    if (emailJobs.length > 0) {
      Promise.allSettled(
        emailJobs.map((job) =>
          sendMonthSettlementEmail(job, job.email).catch((err) =>
            console.error(`[Email] Failed to send settlement email to ${job.email}:`, err)
          )
        )
      ).then((results) => {
        const delivered = results.filter((r) => r.status === 'fulfilled').length;
        console.log(`[Email] Month settlement emails: ${delivered}/${emailJobs.length} successfully processed.`);
      });
    }

    revalidatePath('/admin/reports');
    revalidatePath('/admin/wallet');
    revalidatePath('/admin/members');
    revalidatePath('/admin/dashboard');
    revalidatePath('/member/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to close and settle month:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to settle month' };
  }
}

/**
 * Admin: Reopen a settled month (in case corrections are needed)
 */
export async function reopenMonthSettlement(settlementId: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.organizationId || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized: Admin access required.' };
  }

  const organizationId = session.user.organizationId;

  try {
    const settlement = await prisma.monthSettlement.findFirst({
      where: { id: settlementId, organizationId },
      include: { memberSettlements: true },
    });

    if (!settlement) {
      return { success: false, error: 'Settlement record not found.' };
    }

    const monthLabel = `${MONTH_NAMES[settlement.month - 1]} ${settlement.year}`;

    await prisma.$transaction(async (tx) => {
      // 1. Find and delete carryover / exit transactions created for this settlement
      const generatedTransactions = await tx.walletTransaction.findMany({
        where: {
          organizationId,
          OR: [
            { description: { contains: `from ${monthLabel}` } },
            { description: { contains: `${monthLabel} Settlement` } },
          ],
        },
      });

      for (const t of generatedTransactions) {
        // Reverse wallet balance impact
        const user = await tx.user.findUnique({
          where: { id: t.userId },
          select: { walletBalance: true },
        });

        if (user) {
          const revertedBalance =
            t.type === TransactionType.CREDIT
              ? user.walletBalance - t.amount
              : user.walletBalance + t.amount;

          await tx.user.update({
            where: { id: t.userId },
            data: { walletBalance: revertedBalance },
          });
        }

        await tx.walletTransaction.delete({
          where: { id: t.id },
        });
      }

      // 2. Reactivate any users who were deactivated by this settlement if they were continuing or exited
      for (const ms of settlement.memberSettlements) {
        if (!ms.isContinuing) {
          await tx.user.update({
            where: { id: ms.userId },
            data: { isActive: true },
          });
        }
      }

      // 3. Delete the MonthSettlement record (cascading deletes memberSettlements)
      await tx.monthSettlement.delete({
        where: { id: settlement.id },
      });
    });

    revalidatePath('/admin/reports');
    revalidatePath('/admin/wallet');
    revalidatePath('/admin/members');
    revalidatePath('/admin/dashboard');
    revalidatePath('/member/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to reopen month settlement:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reopen settlement' };
  }
}
