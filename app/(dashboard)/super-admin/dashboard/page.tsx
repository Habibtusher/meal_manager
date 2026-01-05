import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { 
  Users, 
  Building2, 
  Utensils, 
  MessageSquare,
  TrendingUp,
  Activity
} from 'lucide-react';

export default async function SuperAdminDashboard() {
  const [
    orgCount,
    userCount,
    mealCount,
    ticketCount,
    recentOrgs
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.mealRecord.count(),
    (prisma as any).supportTicket.count(),
    prisma.organization.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { users: true }
        }
      }
    })
  ]);

  const stats = [
    { label: 'Total Organizations', value: orgCount, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Users', value: userCount, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Meals Recorded', value: mealCount, icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Support Tickets', value: ticketCount, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500">Manage your SaaS platform and monitor growth.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Organizations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Recent Organizations
            </h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Org Name</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Users</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrgs.map((org: any) => (
                  <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{org.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{org._count.users}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                        {org.type}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrgs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500 italic">No organizations found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Quick Actions */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-green-500" />
                    System Status
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <span className="text-sm text-gray-600 font-medium">Database Node</span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Healthy
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <span className="text-sm text-gray-600 font-medium">Auth Service</span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Active
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
                <h3 className="font-bold mb-2">Quick Actions</h3>
                <p className="text-blue-100 text-sm mb-4">Speed up your administrative tasks with these shortcuts.</p>
                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors text-center border border-white/10">
                        Add New Org
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors text-center border border-white/10">
                        Check Tickets
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
