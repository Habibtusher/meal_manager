import { auth } from '@/lib/auth';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Suspense } from 'react';
import { ExpensesSkeleton } from '@/components/expenses/ExpensesSkeleton';
import { ExpensesContent } from '@/components/expenses/ExpensesContent';

const ITEMS_PER_PAGE = 10;

export default async function MemberExpenses({
    searchParams,
}: {
    searchParams: Promise<{ month?: string; year?: string; page?: string }>;
}) {
    const session = await auth();
    if (!session?.user?.organizationId) return null;
    const organizationId = session.user.organizationId;

    const params = await searchParams;
    const now = new Date();
    const selectedMonth = params.month ? parseInt(params.month) : now.getMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getFullYear();
    const currentPage = Math.max(1, parseInt(params.page || '1') || 1);

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Organization Expenses</h1>
                    <p className="text-gray-500 mt-1">View the latest expenditures for your organization.</p>
                </div>
                <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
            </div>

            <Suspense key={`${selectedMonth}-${selectedYear}-${currentPage}`} fallback={<ExpensesSkeleton />}>
                <ExpensesContent
                    organizationId={organizationId}
                    startDate={startDate}
                    endDate={endDate}
                    currentPage={currentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </Suspense>
        </div>
    );
}

