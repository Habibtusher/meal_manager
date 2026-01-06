import { getOrganizationReports } from "@/lib/services/reports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { formatCurrency, cn } from "@/lib/utils";
import ExportReportsButton from "@/components/admin/ExportReportsButton";

interface ReportsContentProps {
    organizationId: string;
    selectedMonth: number;
    selectedYear: number;
    startDate: Date;
    endDate: Date;
}

export async function ReportsContent({
    organizationId,
    selectedMonth,
    selectedYear,
    startDate,
    endDate
}: ReportsContentProps) {
    const { totalExpenses, totalMeals, mealRate, reportData, memberCount } = await getOrganizationReports(
        organizationId,
        startDate,
        endDate
    );

    return (
        <div className="space-y-6">

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
                            {memberCount}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Member Settlement Summary</CardTitle>
                            <CardDescription>Costs calculated based on the current meal rate.</CardDescription>
                        </div>
                        <ExportReportsButton data={reportData} mealRate={mealRate} />
                    </div>
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
                                {reportData.map((data) => {
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
