import { getPlatformStats } from "@/lib/services/super-admin";
import { Users, Building2, Utensils, MessageSquare } from "lucide-react";

export async function SuperAdminStatsCards() {
    const stats = await getPlatformStats();

    const data = [
        { label: 'Total Organizations', value: stats.orgCount, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Users', value: stats.userCount, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Meals Recorded', value: stats.mealCount, icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-100' },
        { label: 'Support Tickets', value: stats.ticketCount, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className={`${stat.bg} p-3 rounded-xl`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
