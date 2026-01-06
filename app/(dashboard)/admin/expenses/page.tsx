import { auth } from '@/lib/auth';
import { getToday } from '@/lib/utils';
import AddExpenseModal from '@/components/expenses/AddExpenseModal';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Suspense } from 'react';
import { AdminExpensesSkeleton } from '@/components/expenses/AdminExpensesSkeleton';
import { AdminExpensesContent } from '@/components/expenses/AdminExpensesContent';

interface ExpenseManagementProps {
    searchParams: Promise<{ month?: string; year?: string; query?: string; page?: string }>;
}

const ITEMS_PER_PAGE = 10;

export default async function ExpenseManagement({ searchParams }: ExpenseManagementProps) {
    const session = await auth();
    if (!session?.user?.organizationId) return null;
    const organizationId = session.user.organizationId;

    const params = await searchParams;
    const now = getToday();
    const selectedMonth = params.month ? parseInt(params.month) : now.getUTCMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getUTCFullYear();
    const currentPage = Math.max(1, parseInt(params.page || '1') || 1);

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Expense Tracking</h1>
                    <p className="text-gray-500 mt-1">Track daily mess costs and inventory purchases.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
                    <AddExpenseModal />
                </div>
            </div>

            <Suspense key={`${selectedMonth}-${selectedYear}-${params.query}-${currentPage}`} fallback={<AdminExpensesSkeleton />}>
                <AdminExpensesContent
                    organizationId={organizationId}
                    startDate={startDate}
                    endDate={endDate}
                    currentPage={currentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    searchQuery={params.query}
                />
            </Suspense>
        </div>
    );
}
