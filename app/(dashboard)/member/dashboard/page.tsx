import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Wallet, Utensils, History, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getRemainingBalance } from '@/lib/calculations';
import { MonthPicker } from '@/components/ui/MonthPicker';

// Member Dashboard with Month Filter and Dynamic Stats
export default async function MemberDashboard({
    searchParams,
}: {
    searchParams: Promise<{ month?: string; year?: string }>;
}) {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.organizationId) return null;
    const userId = session.user.id;
    const organizationId = session.user.organizationId;

    const params = await searchParams;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Parse selected date or default to current
    const selectedMonth = params.month ? parseInt(params.month) : now.getMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

    // Fetch data in parallel
    const [
        userBalance,
        ,
        ,
        orgStats,
        userStats,
        latestExpenses
    ] = await Promise.all([
        getRemainingBalance(userId),
        prisma.mealSchedule.findMany({
            where: { organizationId, date: today, isActive: true },
        }),
        prisma.mealRecord.findMany({
            where: { userId, date: today },
        }),
        // Organization wide stats for Meal Rate
        prisma.$transaction([
            prisma.expense.aggregate({
                where: {
                    organizationId,
                    date: { gte: startDate, lte: endDate }
                },
                _sum: { amount: true }
            }),
            prisma.mealRecord.aggregate({
                where: {
                    user: { organizationId },
                    status: 'CONFIRMED',
                    date: { gte: startDate, lte: endDate }
                },
                _sum: { count: true }
            })
        ]),
        // User specific stats for Filtered Month
        prisma.mealRecord.aggregate({
            where: {
                userId,
                status: 'CONFIRMED',
                date: { gte: startDate, lte: endDate }
            },
            _sum: { count: true }
        }),
        prisma.expense.findMany({
            where: { organizationId },
            orderBy: { date: 'desc' },
            take: 10
        })
    ]);

    const totalOrgExpenses = orgStats[0]._sum.amount || 0;
    const totalOrgMeals = orgStats[1]._sum.count || 0;
    const userTotalMeals = userStats._sum.count || 0;

    // Calculate Meal Rate (Avoid division by zero)
    const mealRate = totalOrgMeals > 0 ? totalOrgExpenses / totalOrgMeals : 0;

    // User's monthly cost based on the calculated rate
    const monthlyCost = userTotalMeals * mealRate;

    const stats = [
        {
            label: 'Wallet Balance',
            value: formatCurrency(userBalance),
            icon: Wallet,
            color: userBalance < 200 ? 'text-red-600' : 'text-green-600',
            bg: userBalance < 200 ? 'bg-red-50' : 'bg-green-50',
        },
        {
            label: 'This Month Cost',
            value: formatCurrency(monthlyCost),
            icon: CreditCard,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Total Meals',
            value: userTotalMeals.toFixed(1),
            icon: Utensils,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            label: 'Current Meal Rate',
            value: formatCurrency(mealRate),
            icon: History, // Or TrendingUp if imported
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-500 mt-1">Hello, {session?.user.name}! Track your meals and balance here.</p>
                </div>
                <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={cn('p-4 rounded-2xl', stat.bg)}>
                                    <stat.icon className={cn('w-8 h-8', stat.color)} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Notifications */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-lg">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {userBalance < 200 && (
                            <div className="flex items-start gap-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <p>Your wallet balance is low. Please deposit cash to continue tracking meals smoothly.</p>
                            </div>
                        )}
                        <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                            Welcome to your new Meal Manager dashboard!
                        </div>
                    </CardContent>
                </Card>

                {/* Latest Expenses */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Latest Expenses</CardTitle>
                            <CardDescription>Recent organization expenditures</CardDescription>
                        </div>
                        <Link href="/member/expenses">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-bold">
                                View More
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {latestExpenses.map((expense: any) => (
                                <div key={expense.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                            <ShoppingCart className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{expense.description}</p>
                                            <p className="text-[10px] text-gray-400">{formatDate(expense.date)}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                                </div>
                            ))}
                            {latestExpenses.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No recent expenses.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { cn, formatDate } from '@/lib/utils';
import { ParticipationButton } from '@/components/member/ParticipationButton';
import { AlertCircle, ShoppingCart, Receipt } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CardDescription } from '@/components/ui/Card';
