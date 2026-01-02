import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { formatCurrency, cn } from '@/lib/utils';
import { MonthPicker } from '@/components/ui/MonthPicker';

interface MemberHistoryProps {
    searchParams: Promise<{ month?: string; year?: string }>;
}

// Member History with Dynamic Meal Rate
export default async function MemberHistory({ searchParams }: MemberHistoryProps) {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.organizationId) {
        return null;
    }
    const userId = session.user.id;
    const organizationId = session.user.organizationId;

    const params = await searchParams;
    const now = new Date();
    const selectedMonth = params.month ? parseInt(params.month) : now.getMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

    // Fetch data in parallel
    const [records, orgStats] = await Promise.all([
        prisma.mealRecord.findMany({
            where: {
                userId,
                status: 'CONFIRMED',
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
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
        ])
    ]);

    const totalOrgExpenses = orgStats[0]._sum.amount || 0;
    const totalOrgMeals = orgStats[1]._sum.count || 0;

    // Calculate Meal Rate
    const mealRate = totalOrgMeals > 0 ? totalOrgExpenses / totalOrgMeals : 0;

    // Generate all days in the month
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(selectedYear, selectedMonth - 1, i + 1);
        return {
            date: d,
            dateString: d.toISOString().split('T')[0],
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: d.getDate()
        };
    }); // Show oldest first

    // Group records by date
    const historyData = days.map(day => {
        const dayRecords = records.filter((r) => r.date.toISOString().split('T')[0] === day.dateString);

        const breakfast = dayRecords.find((r) => r.mealType === 'BREAKFAST');
        const lunch = dayRecords.find((r) => r.mealType === 'LUNCH');
        const dinner = dayRecords.find((r) => r.mealType === 'DINNER');

        const dailyCount = (breakfast?.count || 0) + (lunch?.count || 0) + (dinner?.count || 0);
        // Use dynamic meal rate for daily cost
        const dailyCost = dailyCount * mealRate;

        return {
            ...day,
            breakfast: breakfast?.count || 0,
            lunch: lunch?.count || 0,
            dinner: dinner?.count || 0,
            total: dailyCount,
            cost: dailyCost
        };
    });

    const totalMonthlyConsumed = records.reduce((sum: number, r) => sum + (r.count || 0), 0);
    // Use dynamic meal rate for total cost
    const totalMonthlyCost = totalMonthlyConsumed * mealRate;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Meal History</h1>
                    <p className="text-gray-500 mt-1">Daily breakdown of your meal consumption.</p>
                </div>
                <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Meals</p>
                        <p className="text-3xl font-extrabold text-blue-600 mt-1">{totalMonthlyConsumed.toFixed(1)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Monthly Cost</p>
                        <p className="text-3xl font-extrabold text-red-600 mt-1">{formatCurrency(totalMonthlyCost)}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daily Meal Log</CardTitle>
                    <CardDescription>Matrix view of {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="py-4 font-medium min-w-[120px]">Date</th>
                                    <th className="py-4 font-medium text-center">Breakfast</th>
                                    <th className="py-4 font-medium text-center">Lunch</th>
                                    <th className="py-4 font-medium text-center">Dinner</th>
                                    <th className="py-4 font-medium text-right">Daily Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {historyData.map((day) => (
                                    <tr key={day.dateString} className={cn("text-sm hover:bg-gray-50 transition-colors", day.total > 0 ? "bg-white" : "bg-gray-50/30")}>
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                    {day.dayNumber}
                                                </div>
                                                <span className="text-gray-600 font-medium">{day.dayName}</span>
                                            </div>
                                        </td>

                                        {['breakfast', 'lunch', 'dinner'].map((type) => {
                                            const count = day[type as keyof typeof day] as number;
                                            return (
                                                <td key={type} className="py-3 text-center">
                                                    <div className="flex justify-center">
                                                        {count > 0 ? (
                                                            <span className={cn(
                                                                "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                                                                count >= 1 ? "bg-blue-100 text-blue-700" : "bg-blue-50 text-blue-600"
                                                            )}>
                                                                {count}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-300">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}

                                        <td className="py-3 text-right">
                                            {day.total > 0 ? (
                                                <div className="inline-block">
                                                    <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                                                        {day.total.toFixed(1)} Meals
                                                    </span>
                                                    <div className="text-[10px] text-gray-400 text-right mt-1">
                                                        {formatCurrency(day.cost)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 text-sm">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
