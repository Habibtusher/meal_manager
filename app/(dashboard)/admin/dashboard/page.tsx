import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Users, Utensils, Wallet, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getMealParticipationStats, getLowBalanceUsers } from '@/lib/calculations';
import { MonthPicker } from '@/components/ui/MonthPicker';

interface DashboardProps {
    searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function AdminDashboard({ searchParams }: DashboardProps) {
    const session = await auth();
    const organizationId = session?.user.organizationId!;

    const params = await searchParams;
    const now = new Date();
    const selectedMonth = params.month ? parseInt(params.month) : now.getMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

    // Fetch stats
    const [
        memberCount,
        participationStats,
        lowBalanceUsers,
        totalStats
    ] = await Promise.all([
        prisma.user.count({ where: { organizationId, role: { in: ['MEMBER', 'ADMIN'] }, isActive: true } }),
        getMealParticipationStats(organizationId, new Date()),
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
            } as any),
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
        ])
    ]);

    const totalExpenses = totalStats[0]._sum.amount || 0;
    const totalMeals = (totalStats[1] as any)._sum.count || 0;
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
        </div>
    );
}

// Add cn import since I used it inside the component locally
import { cn } from '@/lib/utils';
