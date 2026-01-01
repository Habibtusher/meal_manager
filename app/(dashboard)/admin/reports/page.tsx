import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, getToday, cn } from '@/lib/utils';
import { FileText, Download, TrendingUp, TrendingDown, Users } from 'lucide-react';
import ExportReportsButton from '@/components/admin/ExportReportsButton';
import { MonthPicker } from '@/components/ui/MonthPicker';

interface ReportsProps {
    searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function AdminReports({ searchParams }: ReportsProps) {
    const session = await auth();
    const organizationId = session?.user.organizationId!;

    const params = await searchParams;
    const now = getToday();
    const selectedMonth = params.month ? parseInt(params.month) : now.getUTCMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getUTCFullYear();

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999));

    // 1. Fetch expenses for the selected month
    // 2. Fetch all members with their CONFIRMED meal records for the selected month
    const [expenses, members] = await Promise.all([
        prisma.expense.findMany({
            where: {
                organizationId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
        }),
        prisma.user.findMany({
            where: { organizationId, role: { in: ['MEMBER', 'ADMIN'] } },
            include: {
                mealRecords: {
                    where: {
                        status: 'CONFIRMED',
                        date: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                },
                walletTransactions: {
                    where: {
                        type: 'CREDIT',
                        createdAt: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                }
            }
        })
    ]);

    const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0);
    const totalMeals = members.reduce((sum: number, member: any) =>
        sum + member.mealRecords.reduce((mSum: number, r: any) => mSum + (r.count || 0), 0), 0
    );

    // Meal Rate calculation: Total Expenses / Total Meals (Counts)
    const mealRate = totalMeals > 0 ? totalExpenses / totalMeals : 0;

    const reportData = members.map((member: any) => {
        const mealsConsumed = member.mealRecords.reduce((sum: number, r: any) => sum + (r.count || 0), 0);
        const totalMealCost = mealsConsumed * mealRate;
        const totalDeposited = member.walletTransactions.reduce((sum: number, t: any) => sum + Number(t.amount), 0);

        return {
            id: member.id,
            name: member.name,
            mealsConsumed,
            totalMealCost,
            totalDeposited,
            currentBalance: Number(member.walletBalance)
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-500 mt-1">Shared Scaling Billing: Rate = Total Expenses / Total Meals</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
                    <ExportReportsButton data={reportData} mealRate={mealRate} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-blue-100">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Expenses</CardDescription>
                        <CardTitle className="text-2xl font-black text-red-600">
                            {formatCurrency(totalExpenses)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white border-blue-100">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Consumption</CardDescription>
                        <CardTitle className="text-2xl font-black text-blue-600">
                            {totalMeals} <span className="text-sm font-normal text-gray-400">Meals</span>
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-blue-600 text-white shadow-xl shadow-blue-100">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-blue-100">Current Meal Rate</CardDescription>
                        <CardTitle className="text-2xl font-black">
                            {formatCurrency(mealRate)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white border-blue-100">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Active Members</CardDescription>
                        <CardTitle className="text-2xl font-black text-gray-900">
                            {members.length}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Member Settlement Summary</CardTitle>
                    <CardDescription>Costs calculated based on the current meal rate.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 italic text-gray-400 text-xs">
                                    <th className="pb-4 font-medium uppercase tracking-widest px-4">User</th>
                                    <th className="pb-4 font-medium text-center uppercase tracking-widest px-4">Meals</th>
                                    <th className="pb-4 font-medium text-right uppercase tracking-widest px-4">Calculated Cost</th>
                                    <th className="pb-4 font-medium text-right uppercase tracking-widest px-4">Total Deposited</th>
                                    <th className="pb-4 font-medium text-right uppercase tracking-widest px-4">Adjusted Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {reportData.map((data: any) => {
                                    const adjustedBalance = data.totalDeposited - data.totalMealCost;
                                    return (
                                        <tr key={data.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">{data.name}</td>
                                            <td className="py-4 px-4 text-center font-medium text-gray-600">{data.mealsConsumed}</td>
                                            <td className="py-4 px-4 text-right font-bold text-red-500 whitespace-nowrap">{formatCurrency(data.totalMealCost)}</td>
                                            <td className="py-4 px-4 text-right font-bold text-green-600 whitespace-nowrap">{formatCurrency(data.totalDeposited)}</td>
                                            <td className="py-4 px-4 text-right whitespace-nowrap">
                                                <span className={cn(
                                                    'font-black',
                                                    adjustedBalance < 0 ? 'text-red-600 underline' : 'text-gray-900'
                                                )}>
                                                    {formatCurrency(adjustedBalance)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
