import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import DatePicker from '@/components/admin/DatePicker';
import AttendanceBoard from '@/components/admin/AttendanceBoard';
import { redirect } from 'next/navigation';

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
        // Parse "YYYY-MM-DD" explicitly as UTC parts
        const [year, month, day] = dateParam.split('-').map(Number);
        selectedDate = new Date(Date.UTC(year, month - 1, day));
    }
    selectedDate.setUTCHours(0, 0, 0, 0);

    const [members, confirmedRecords] = await Promise.all([
        prisma.user.findMany({
            where: { organizationId, role: { in: ['MEMBER', 'ADMIN'] }, isActive: true },
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' },
        }),
        prisma.mealRecord.findMany({
            where: {
                date: selectedDate,
                user: { organizationId },
                status: 'CONFIRMED'
            },
            select: {
                userId: true,
                mealType: true,
                count: true
            } as any
        })
    ]);

    const initialCounts = confirmedRecords.map((r: any) => ({
        userId: r.userId,
        mealType: r.mealType,
        count: r.count
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Meal Management</h1>
                    <p className="text-gray-500 mt-1">Update daily meal counts (0-3) for members manually.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-sm font-bold text-gray-700 ml-2">Select Date:</span>
                    <DatePicker defaultValue={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`} />
                </div>
            </div>

            <AttendanceBoard
                members={members}
                initialCounts={initialCounts}
                date={selectedDate}
            />
        </div>
    );
}
