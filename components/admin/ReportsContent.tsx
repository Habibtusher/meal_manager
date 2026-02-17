import { getOrganizationReports } from "@/lib/services/reports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { formatCurrency, cn } from "@/lib/utils";
import ExportReportsButton from "@/components/admin/ExportReportsButton";
import SharedCostTooltip from "@/components/admin/SharedCostTooltip";
import { getTranslations } from 'next-intl/server';

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

    const t = await getTranslations('reports');
    const tCommon = await getTranslations('common');

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card border-blue-100 dark:border-blue-900/30">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('totalExpenses')}</CardDescription>
                        <CardTitle className="text-2xl font-black text-red-600">
                            {formatCurrency(totalExpenses)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card border-blue-100 dark:border-blue-900/30">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('totalConsumption')}</CardDescription>
                        <CardTitle className="text-2xl font-black text-blue-600">
                            {totalMeals} <span className="text-sm font-normal text-muted-foreground">{tCommon('meals')}</span>
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-blue-900/20">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-blue-100">{t('currentMealRate')}</CardDescription>
                        <CardTitle className="text-2xl font-black">
                            {formatCurrency(mealRate)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card border-blue-100 dark:border-blue-900/30">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('activeMembers')}</CardDescription>
                        <CardTitle className="text-2xl font-black text-foreground">
                            {memberCount}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>{t('memberSettlementSummary')}</CardTitle>
                            <CardDescription>{t('costsCalculatedInfo')}</CardDescription>
                        </div>
                        <ExportReportsButton data={reportData} mealRate={mealRate} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="relative z-0">
                                <tr className="border-b border-border italic text-muted-foreground text-xs">
                                    <th className="pb-4 font-medium uppercase tracking-widest px-4">{t('user')}</th>
                                    <th className="pb-4 font-medium text-center uppercase tracking-widest px-4">{t('meals')}</th>
                                    <th className="pb-4 font-medium text-right uppercase tracking-widest px-4">{t('mealCost')}</th>
                                    <th className="pb-4 font-medium text-right uppercase tracking-widest px-4">{t('sharedRoom')}</th>
                                    <th className="pb-4 font-medium text-right uppercase tracking-widest px-4">{t('totalCost')}</th>
                                    <th className="pb-4 font-medium text-right uppercase tracking-widest px-4">{t('totalDeposited')}</th>
                                    <th className="pb-4 font-medium text-right uppercase tracking-widest px-4">{t('adjustedBalance')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50 text-sm">
                                {reportData.map((data: any) => {
                                    const adjustedBalance = data.totalDeposited - data.totalCost;
                                    return (
                                        <tr key={data.id} className="hover:bg-muted/50 transition-colors relative">
                                            <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">{data.name}</td>
                                            <td className="py-4 px-4 text-center font-medium text-muted-foreground">{data.mealsConsumed}</td>
                                            <td className="py-4 px-4 text-right font-medium text-muted-foreground whitespace-nowrap">{formatCurrency(data.totalMealCost)}</td>
                                            <td className="py-4 px-4 text-right font-medium text-muted-foreground whitespace-nowrap">
                                                <SharedCostTooltip
                                                    totalAmount={data.totalSharedCost}
                                                    details={data.sharedCostDetails || []}
                                                />
                                            </td>
                                            <td className="py-4 px-4 text-right font-bold text-red-500 whitespace-nowrap">{formatCurrency(data.totalCost)}</td>
                                            <td className="py-4 px-4 text-right font-bold text-green-600 whitespace-nowrap">{formatCurrency(data.totalDeposited)}</td>
                                            <td className="py-4 px-4 text-right whitespace-nowrap">
                                                <span className={cn(
                                                    'font-black',
                                                    adjustedBalance < 0 ? 'text-red-600 underline' : 'text-foreground'
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
