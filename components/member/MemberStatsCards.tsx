import { getMemberDashboardStats } from "@/lib/services/member";
import { Card, CardContent } from "@/components/ui/Card";
import { Wallet, Utensils, History, CreditCard } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

interface MemberStatsCardsProps {
    userId: string;
    organizationId: string;
    month: number;
    year: number;
}

export async function MemberStatsCards({ userId, organizationId, month, year }: MemberStatsCardsProps) {
    const {
        userBalance,
        userTotalMeals,
        mealRate,
        monthlyCost
    } = await getMemberDashboardStats(userId, organizationId, month, year);

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
            icon: History,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
    ];

    return (
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
    );
}
