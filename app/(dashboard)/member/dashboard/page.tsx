import { auth } from '@/lib/auth';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Suspense } from 'react';
import { StatsSkeleton, ListSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { MemberStatsCards } from '@/components/member/MemberStatsCards';
import { MemberNotifications } from '@/components/member/MemberNotifications';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';

export default async function MemberDashboard({
    searchParams,
}: {
    searchParams: Promise<{ month?: string; year?: string }>;
}) {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.organizationId) return null;
    const userId = session.user.id;
    const organizationId = session.user.organizationId;

    const params = await searchParams;
    const now = new Date();
    const selectedMonth = params.month ? parseInt(params.month) : now.getMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getFullYear();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-500 mt-1">Hello, {session?.user.name}! Track your meals and balance here.</p>
                </div>
                <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
            </div>

            <Suspense fallback={<StatsSkeleton />}>
                <MemberStatsCards
                    userId={userId}
                    organizationId={organizationId}
                    month={selectedMonth}
                    year={selectedYear}
                />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Suspense fallback={<ListSkeleton />}>
                    <MemberNotifications
                        userId={userId}
                        organizationId={organizationId}
                        month={selectedMonth}
                        year={selectedYear}
                    />
                </Suspense>

                <div className="lg:col-span-2">
                    <Suspense fallback={<ListSkeleton />}>
                        <RecentExpenses
                            organizationId={organizationId}
                            viewAllLink="/member/expenses"
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
