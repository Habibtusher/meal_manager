import { Activity } from 'lucide-react';
import { Suspense } from 'react';
import Link from 'next/link';
import { SuperAdminStatsSkeleton, SuperAdminRecentOrgsSkeleton } from '@/components/super-admin/DashboardSkeleton';
import { SuperAdminStatsCards } from '@/components/super-admin/SuperAdminStatsCards';
import { RecentOrganizationsList } from '@/components/super-admin/RecentOrganizationsList';
import { getTranslations } from 'next-intl/server';

export default async function SuperAdminDashboard() {
  const t = await getTranslations('superAdmin');
  const tCommon = await getTranslations('common');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('platformOverview')}</h1>
        <p className="text-muted-foreground">{t('managePlatformSubtitle')}</p>
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
              {t('systemStatus')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground font-medium">{t('databaseNode')}</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {tCommon('healthy')}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground font-medium">{t('authService')}</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {tCommon('active')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 p-6 rounded-2xl text-white shadow-xl shadow-emerald-500/15">
            <h3 className="font-bold mb-2">{t('quickActions')}</h3>
            <p className="text-emerald-100 text-sm mb-4">{t('quickActionsSubtitle')}</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/super-admin/organizations"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors text-center border border-white/10 block"
              >
                {t('manageOrgs')}
              </Link>
              <Link
                href="/super-admin/tickets"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors text-center border border-white/10 block"
              >
                {t('checkTickets')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
