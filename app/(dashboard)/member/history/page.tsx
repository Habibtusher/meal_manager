import { auth } from '@/lib/auth';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Suspense } from 'react';
import { HistorySkeleton } from '@/components/member/HistorySkeleton';
import { HistoryContent } from '@/components/member/HistoryContent';

interface MemberHistoryProps {
    searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function MemberHistory({ searchParams }: MemberHistoryProps) {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.organizationId) {
        return null;
    }
    const userId = session.user.id;
    const organizationId = session.user.organizationId;

    const params = await searchParams;
    const now = new Date();
    const selectedMonth = params.month ? parseInt(params.month) : now.getMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Meal History</h1>
                    <p className="text-gray-500 mt-1">Daily breakdown of your meal consumption.</p>
                </div>
                <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
            </div>

            <Suspense key={`${selectedMonth}-${selectedYear}`} fallback={<HistorySkeleton />}>
                <HistoryContent
                    userId={userId}
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
