import { Activity } from 'lucide-react';
import { Suspense } from 'react';
import Link from 'next/link';
import { SuperAdminStatsSkeleton, SuperAdminRecentOrgsSkeleton } from '@/components/super-admin/DashboardSkeleton';
import { SuperAdminStatsCards } from '@/components/super-admin/SuperAdminStatsCards';
import { RecentOrganizationsList } from '@/components/super-admin/RecentOrganizationsList';

export default async function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-muted-foreground">Manage your SaaS platform and monitor growth.</p>
      </div>

      <Suspense fallback={<SuperAdminStatsSkeleton />}>
        <SuperAdminStatsCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<SuperAdminRecentOrgsSkeleton />}>
          <RecentOrganizationsList />
        </Suspense>

        <div className="space-y-6">
          <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-green-500" />
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground font-medium">Database Node</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground font-medium">Auth Service</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 p-6 rounded-2xl text-white shadow-xl shadow-emerald-500/15">
            <h3 className="font-bold mb-2">Quick Actions</h3>
            <p className="text-emerald-100 text-sm mb-4">Speed up your administrative tasks with these shortcuts.</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/super-admin/organizations"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors text-center border border-white/10 block"
              >
                Manage Orgs
              </Link>
              <Link
                href="/super-admin/tickets"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors text-center border border-white/10 block"
              >
                Check Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
