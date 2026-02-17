import { auth } from '@/lib/auth';
import DatePicker from '@/components/admin/DatePicker';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AttendanceSkeleton } from '@/components/admin/AttendanceSkeleton';
import { AttendanceBoardContent } from '@/components/admin/AttendanceBoardContent';

export default async function MealManagement({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const organizationId = session.user.organizationId;
    const { date: dateParam } = await searchParams;
    const { getToday } = await import('@/lib/utils');

    let selectedDate = getToday();
    if (dateParam) {
        const [year, month, day] = dateParam.split('-').map(Number);
        selectedDate = new Date(Date.UTC(year, month - 1, day));
    }
    selectedDate.setUTCHours(0, 0, 0, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Meal Management</h1>
                    <p className="text-muted-foreground mt-1">Update daily meal counts (0-3) for members manually.</p>
                </div>
                <div className="flex items-center gap-3 bg-card p-2 rounded-xl border border-border shadow-sm">
                    <span className="text-sm font-bold text-foreground ml-2">Select Date:</span>
                    <DatePicker defaultValue={`${selectedDate.getUTCFullYear()}-${String(selectedDate.getUTCMonth() + 1).padStart(2, '0')}-${String(selectedDate.getUTCDate()).padStart(2, '0')}`} />
                </div>
            </div>

            <Suspense key={selectedDate.toISOString()} fallback={<AttendanceSkeleton />}>
                <AttendanceBoardContent
                    organizationId={organizationId as string}
                    date={selectedDate}
                />
            </Suspense>
        </div>
    );
}
