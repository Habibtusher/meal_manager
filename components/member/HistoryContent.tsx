import { getMemberMealHistory } from "@/lib/services/history";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { formatCurrency, cn } from "@/lib/utils";

interface HistoryContentProps {
    userId: string;
    organizationId: string;
    selectedMonth: number;
    selectedYear: number;
    startDate: Date;
    endDate: Date;
}

export async function HistoryContent({
    userId,
    organizationId,
    selectedMonth,
    selectedYear,
    startDate,
    endDate
}: HistoryContentProps) {
    const { records, mealRate } = await getMemberMealHistory(userId, organizationId, startDate, endDate);

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
    });

    // Group records by date
    const historyData = days.map(day => {
        const dayRecords = records.filter((r) => r.date.toISOString().split('T')[0] === day.dateString);

        const breakfast = dayRecords.find((r) => r.mealType === 'BREAKFAST');
        const lunch = dayRecords.find((r) => r.mealType === 'LUNCH');
        const dinner = dayRecords.find((r) => r.mealType === 'DINNER');

        const dailyCount = (breakfast?.count || 0) + (lunch?.count || 0) + (dinner?.count || 0);
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
    const totalMonthlyCost = totalMonthlyConsumed * mealRate;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Total Meals</p>
                        <p className="text-3xl font-extrabold text-blue-600 mt-1">{totalMonthlyConsumed.toFixed(1)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Total Monthly Cost</p>
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
                                <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    <th className="py-4 font-medium min-w-[120px]">Date</th>
                                    <th className="py-4 font-medium text-center">Breakfast</th>
                                    <th className="py-4 font-medium text-center">Lunch</th>
                                    <th className="py-4 font-medium text-center">Dinner</th>
                                    <th className="py-4 font-medium text-right">Daily Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {historyData.map((day) => (
                                    <tr key={day.dateString} className={cn("text-sm hover:bg-muted/50 transition-colors", day.total > 0 ? "bg-card" : "bg-muted/10")}>
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs">
                                                    {day.dayNumber}
                                                </div>
                                                <span className="text-muted-foreground font-medium">{day.dayName}</span>
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
                                                                count >= 1 ? "bg-blue-500/10 text-blue-500" : "bg-blue-500/5 text-blue-500/80"
                                                            )}>
                                                                {count}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground/30">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}

                                        <td className="py-3 text-right">
                                            {day.total > 0 ? (
                                                <div className="inline-block">
                                                    <span className="bg-muted text-foreground px-3 py-1 rounded-full text-xs font-bold">
                                                        {day.total.toFixed(1)} Meals
                                                    </span>
                                                    <div className="text-[10px] text-muted-foreground text-right mt-1">
                                                        {formatCurrency(day.cost)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground/30 text-sm">-</span>
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
