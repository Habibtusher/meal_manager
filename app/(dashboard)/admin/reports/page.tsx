import { auth } from '@/lib/auth';
import { getToday } from '@/lib/utils';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Suspense } from 'react';
import { ReportsSkeleton } from '@/components/admin/ReportsSkeleton';
import { ReportsContent } from '@/components/admin/ReportsContent';

interface ReportsProps {
    searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function AdminReports({ searchParams }: ReportsProps) {
    const session = await auth();
    if (!session?.user?.organizationId) return null;
    const organizationId = session.user.organizationId;

    const params = await searchParams;
    const now = getToday();
    const selectedMonth = params.month ? parseInt(params.month) : now.getUTCMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getUTCFullYear();

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-500 mt-1">Shared Scaling Billing: Rate = Total Expenses / Total Meals</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
                </div>
            </div>

            <Suspense key={`${selectedMonth}-${selectedYear}`} fallback={<ReportsSkeleton />}>
                <ReportsContent
                    organizationId={organizationId}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    startDate={startDate}
                    endDate={endDate}
                />
            </Suspense>
        </div>
    );
}
