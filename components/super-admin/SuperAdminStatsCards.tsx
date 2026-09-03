import { getPlatformStats } from "@/lib/services/super-admin";
import { Users, Building2, Utensils, MessageSquare } from "lucide-react";
import { getTranslations } from 'next-intl/server';

export async function SuperAdminStatsCards() {
    const stats = await getPlatformStats();
    const t = await getTranslations('superAdmin');

    const data = [
        { label: t('totalOrganizations'), value: stats.orgCount, icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: t('totalUsers'), value: stats.userCount, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: t('mealsRecorded'), value: stats.mealCount, icon: Utensils, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: t('supportTickets'), value: stats.ticketCount, icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((stat, index) => (
                <div key={index} className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-4">
                        <div className={`${stat.bg} p-3.5 rounded-2xl`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs uppercase font-semibold text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
