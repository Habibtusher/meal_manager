import { Activity } from 'lucide-react';
import { Suspense } from 'react';
import { SuperAdminStatsSkeleton, SuperAdminRecentOrgsSkeleton } from '@/components/super-admin/DashboardSkeleton';
import { SuperAdminStatsCards } from '@/components/super-admin/SuperAdminStatsCards';
import { RecentOrganizationsList } from '@/components/super-admin/RecentOrganizationsList';

export default async function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500">Manage your SaaS platform and monitor growth.</p>
      </div>

      <Suspense fallback={<SuperAdminStatsSkeleton />}>
        <SuperAdminStatsCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<SuperAdminRecentOrgsSkeleton />}>
          <RecentOrganizationsList />
        </Suspense>

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
