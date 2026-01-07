import { auth } from '@/lib/auth';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { getToday } from '@/lib/utils';
import { Suspense } from 'react';
import { StatsSkeleton, ListSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { AdminLowBalanceAlerts } from '@/components/admin/AdminLowBalanceAlerts';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';

interface DashboardProps {
    searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function AdminDashboard({ searchParams }: DashboardProps) {
    const session = await auth();
    if (!session?.user?.organizationId) return null;
    const organizationId = session.user.organizationId;

    const params = await searchParams;
    const now = getToday();

    let selectedMonth = params.month ? parseInt(params.month) : now.getUTCMonth() + 1;
    let selectedYear = params.year ? parseInt(params.year) : now.getUTCFullYear();

    if (isNaN(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
        selectedMonth = now.getUTCMonth() + 1;
    }
    if (isNaN(selectedYear) || selectedYear < 2000 || selectedYear > 2100) {
        selectedYear = now.getUTCFullYear();
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Admin! Here is what is happening today.</p>
                </div>
                <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
            </div>

            <Suspense fallback={<StatsSkeleton />}>
                <AdminStatsCards
                    organizationId={organizationId}
                    month={selectedMonth}
                    year={selectedYear}
                />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Suspense fallback={<ListSkeleton />}>
                    <AdminLowBalanceAlerts
                        organizationId={organizationId}
                        month={selectedMonth}
                        year={selectedYear}
                    />
                </Suspense>

                <Suspense fallback={<ListSkeleton />}>
                    <RecentExpenses organizationId={organizationId} viewAllLink="/admin/expenses" />
                </Suspense>
            </div>
        </div>
    );
}


