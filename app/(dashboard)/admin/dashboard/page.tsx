import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Users, Utensils, Wallet, TrendingUp, AlertCircle, ShoppingCart } from 'lucide-react';
import { formatCurrency, getToday, cn, formatDate } from '@/lib/utils';
import { getMealParticipationStats, getLowBalanceUsers } from '@/lib/calculations';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface DashboardProps {
    searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function AdminDashboard({ searchParams }: DashboardProps) {
    const session = await auth();
    if (!session?.user?.organizationId) return null;
    const organizationId = session.user.organizationId;

    const params = await searchParams;
    const now = getToday();
    const selectedMonth = params.month ? parseInt(params.month) : now.getUTCMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getUTCFullYear();

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999));

    // Fetch stats
    const [
        memberCount,
        ,
        lowBalanceUsers,
        totalStats,
        latestExpenses
    ] = await Promise.all([
        prisma.user.count({ where: { organizationId, role: { in: ['MEMBER', 'ADMIN'] }, isActive: true } }),
        getMealParticipationStats(organizationId, getToday()),
        getLowBalanceUsers(organizationId, 200),
        // Group aggregations for efficiency
        prisma.$transaction([
            prisma.expense.aggregate({
                where: {
                    organizationId,
                    date: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                _sum: { amount: true }
            }),
            prisma.mealRecord.aggregate({
                where: {
                    user: { organizationId },
                    status: 'CONFIRMED',
                    date: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                _sum: { count: true }
            }),
            prisma.walletTransaction.aggregate({
                where: {
                    organizationId,
                    type: 'CREDIT',
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                _sum: { amount: true }
            })
        ]),
        prisma.expense.findMany({
            where: { organizationId },
            orderBy: { createdAt: 'desc' },
            take: 10
        })
    ]);

    const totalExpenses = totalStats[0]._sum.amount || 0;
    const totalMeals = totalStats[1]._sum.count || 0;
    const totalDeposits = totalStats[2]._sum.amount || 0;

    // Balance = (Total Deposits - Total Expenses) for the selected period
    // Ideally this is "Net Cash Flow" if filtered by month
    const availableBalance = totalDeposits - totalExpenses;

    const mealRate = totalMeals > 0 ? totalExpenses / totalMeals : 0;

    const stats = [
        {
            label: 'Available Balance',
            value: formatCurrency(availableBalance),
            icon: Wallet,
            color: availableBalance >= 0 ? 'text-green-600' : 'text-red-600',
            bg: availableBalance >= 0 ? 'bg-green-50' : 'bg-red-50',
        },
        {
            label: 'Total Expenses',
            value: formatCurrency(totalExpenses),
            icon: Wallet,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
        {
            label: 'Total Meals',
            value: totalMeals.toFixed(1),
            icon: Utensils,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Current Meal Rate',
            value: formatCurrency(mealRate),
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
        },
        {
            label: 'Active Members',
            value: memberCount,
            icon: Users,
            color: 'text-gray-600',
            bg: 'bg-gray-100',
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Admin! Here is what is happening today.</p>
                </div>
                <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} hover>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={cn('p-3 rounded-xl', stat.bg)}>
                                    <stat.icon className={cn('w-6 h-6', stat.color)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Stats Breakout */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Today&apos;s Meal Participation</CardTitle>
                        <CardDescription>Breakdown by meal type for {new Date().toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-100">
                                <p className="text-sm text-gray-500">Breakfast</p>
                                <p className="text-xl font-bold text-gray-900">{participationStats.breakfast}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-100">
                                <p className="text-sm text-gray-500">Lunch</p>
                                <p className="text-xl font-bold text-gray-900">{participationStats.lunch}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-100">
                                <p className="text-sm text-gray-500">Dinner</p>
                                <p className="text-xl font-bold text-gray-900">{participationStats.dinner}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card> */}

                {/* Low Balance Warning */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    Low Balance Alerts
                                </CardTitle>
                                <CardDescription>Users with balance below ৳200</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {lowBalanceUsers.length > 0 ? (
                                    lowBalanceUsers.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-red-600">{formatCurrency(user.walletBalance)}</p>
                                                <button className="text-[10px] text-blue-600 hover:underline font-medium">Inform User</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No users with low balance.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Latest Expenses */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Latest Expenses</CardTitle>
                            <CardDescription>Recent organization expenditures</CardDescription>
                        </div>
                        <Link href="/admin/expenses">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-bold">
                                View More
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {latestExpenses.map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-blue-500">
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


