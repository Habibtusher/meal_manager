import { getAdminDashboardStats } from "@/lib/services/admin";
import { Card, CardContent } from "@/components/ui/Card";
import { Wallet, Utensils, TrendingUp, Users } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

interface AdminStatsCardsProps {
    organizationId: string;
    month: number;
    year: number;
}

export async function AdminStatsCards({ organizationId, month, year }: AdminStatsCardsProps) {
    const {
        memberCount,
        availableBalance,
        totalExpenses,
        totalMeals,
        mealRate
    } = await getAdminDashboardStats(organizationId, month, year);

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
    );
}
