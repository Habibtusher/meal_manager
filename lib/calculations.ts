import prisma from './prisma';
import { TransactionType } from '@prisma/client';

/**
 * Calculate total meal count (sum of partial/full meals) for a user in a range
 */
export async function calculateUserTotalMeals(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const records = await prisma.mealRecord.findMany({
    where: {
      userId,
      status: 'CONFIRMED',
      date: { gte: startDate, lte: endDate },
    },
    select: { count: true },
  });

  return records.reduce((sum: number, r) => sum + (r.count || 0), 0);
}

/**
 * Calculate monthly estimated cost for a user based on current month's expenses
 * Note: This is an estimation until the month is closed.
 */
export async function calculateMonthlyUserCost(
  userId: string,
  month: number,
  year: number
): Promise<number> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const [userMeals, totalMeals, totalExpenses] = await Promise.all([
    calculateUserTotalMeals(userId, startDate, endDate),
    prisma.mealRecord.aggregate({
      where: {
        date: { gte: startDate, lte: endDate },
        status: 'CONFIRMED',
      },
      _sum: { count: true },
    }),
    prisma.expense.aggregate({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    }),
  ]);

  const totalMealCount = totalMeals._sum.count || 0;
  const totalExp = totalExpenses._sum.amount || 0;
  const rate = totalMealCount > 0 ? totalExp / totalMealCount : 0;

  return userMeals * rate;
}

/**
 * Get total meal count (sum of counts) for a user in a range
 */
export async function getTotalMealCount(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  return calculateUserTotalMeals(userId, startDate, endDate);
}

/**
 * Get remaining wallet balance for a user
 */
export async function getRemainingBalance(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { walletBalance: true },
  });

  return user ? Number(user.walletBalance) : 0;
}

/**
 * Deduct meal cost from user wallet and create transaction record
 */
export async function deductMealCost(
  userId: string,
  mealScheduleId: string,
  organizationId: string
): Promise<void> {
  // Get meal price
  const mealSchedule = await prisma.mealSchedule.findUnique({
    where: { id: mealScheduleId },
    select: { price: true, menu: true, mealType: true },
  });

  if (!mealSchedule) {
    throw new Error('Meal schedule not found');
  }

  const mealPrice = Number(mealSchedule.price);

  // Use transaction to ensure atomicity
  await prisma.$transaction(async (tx) => {
    // Get current balance
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentBalance = Number(user.walletBalance);
    const newBalance = currentBalance - mealPrice;

    // Update user balance
    await tx.user.update({
      where: { id: userId },
      data: { walletBalance:  newBalance  },
    });

    // Create transaction record
    await tx.walletTransaction.create({
      data: {
        userId,
        organizationId,
        type: TransactionType.DEBIT,
        amount: mealPrice,
        description: `Meal: ${mealSchedule.mealType} - ${mealSchedule.menu}`,
        balanceAfter: newBalance,
      },
    });
  });
}

/**
 * Add credit to user wallet
 */
export async function creditWallet(
  userId: string,
  amount: number,
  description: string,
  organizationId: string,
  date: Date
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Get current balance
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentBalance = Number(user.walletBalance);
    const newBalance = currentBalance + amount;

    // Update user balance
    await tx.user.update({
      where: { id: userId },
      data: { walletBalance:  newBalance  },
    });

    // Create transaction record
    await tx.walletTransaction.create({
      data: {
        userId,
        organizationId,
        type: TransactionType.CREDIT,
        amount,
        description,
        balanceAfter: newBalance,
        createdAt: date
      },
    });
  });
}

/**
 * Check if user can afford a meal
 */
export async function canAffordMeal(
  userId: string,
  mealPrice: number
): Promise<boolean> {
  const balance = await getRemainingBalance(userId);
  return balance >= mealPrice;
}

/**
 * Get all members with their adjusted balance for a specific month.
 * Adjusted balance = Total Deposited - Total Cost (meal cost + shared costs),
 * using the same formula as the settlement summary in reports.
 */
export async function getMembersWithBalance(
  organizationId: string,
  month?: number,
  year?: number
): Promise<Array<{ id: string; name: string; email: string; totalDeposited: number; totalCost: number; adjustedBalance: number }>> {
  // Default to current month if not provided
  const now = new Date();
  const m = month || (now.getMonth() + 1);
  const y = year || now.getFullYear();
  const startDate = new Date(Date.UTC(y, m - 1, 1));
  const endDate = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

  // 1. Fetch all active users with their meal records, wallet credits, and shared cost allocations
  const members = await prisma.user.findMany({
    where: {
      organizationId,
      isActive: true,
      role: { in: ['MEMBER', 'ADMIN'] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      mealRecords: {
        where: {
          status: 'CONFIRMED',
          date: { gte: startDate, lte: endDate },
        },
        select: { count: true },
      },
      walletTransactions: {
        where: {
          type: 'CREDIT',
          createdAt: { gte: startDate, lte: endDate },
        },
        select: { amount: true },
      },
      sharedCostAllocations: {
        where: {
          sharedCost: {
            date: { gte: startDate, lte: endDate },
          },
        },
        select: { amount: true },
      },
    },
  });

  // 2. Calculate the meal rate for this period (same as reports)
  const totalExpensesAgg = await prisma.expense.aggregate({
    where: {
      organizationId,
      date: { gte: startDate, lte: endDate },
    },
    _sum: { amount: true },
  });

  const totalExpenses = totalExpensesAgg._sum.amount || 0;
  const totalMeals = members.reduce(
    (sum, member) => sum + member.mealRecords.reduce((mSum, r) => mSum + (r.count || 0), 0),
    0
  );
  const mealRate = totalMeals > 0 ? totalExpenses / totalMeals : 0;

  // 3. Calculate financial data for each user
  const allMembers = members.map((member) => {
    const mealsConsumed = member.mealRecords.reduce((sum, r) => sum + (r.count || 0), 0);
    const totalMealCost = mealsConsumed * mealRate;
    const totalSharedCost = member.sharedCostAllocations.reduce(
      (sum, alloc) => sum + Number(alloc.amount),
      0
    );
    const totalCost = totalMealCost + totalSharedCost;
    const totalDeposited = member.walletTransactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );
    const adjustedBalance = totalDeposited - totalCost;

    return {
      id: member.id,
      name: member.name,
      email: member.email,
      totalDeposited,
      totalCost,
      adjustedBalance,
    };
  });

  return allMembers.sort((a, b) => a.adjustedBalance - b.adjustedBalance);
}


/**
 * Get meal participation statistics for an organization
 */
export async function getMealParticipationStats(
  organizationId: string,
  date: Date
): Promise<{
  breakfast: number;
  lunch: number;
  dinner: number;
  total: number;
}> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const stats = await prisma.mealRecord.groupBy({
        by: ['mealType'],
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay
            },
            status: 'CONFIRMED',
            user: {
                organizationId,
            },
        },
        _count: {
            id: true
        },
    });

  const participation = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    total: 0,
  };

  stats.forEach((stat) => {
    const count = typeof stat._count === 'number' ? stat._count : (stat._count as any)?.id || 0;
    participation.total += count;
    if (stat.mealType === 'BREAKFAST') participation.breakfast = count;
    else if (stat.mealType === 'LUNCH') participation.lunch = count;
    else if (stat.mealType === 'DINNER') participation.dinner = count;
  });

  return participation;
}
