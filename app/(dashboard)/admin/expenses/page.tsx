import { auth } from '@/lib/auth';
import { getToday } from '@/lib/utils';
import AddExpenseModal from '@/components/expenses/AddExpenseModal';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Suspense } from 'react';
import { AdminExpensesSkeleton } from '@/components/expenses/AdminExpensesSkeleton';
import { AdminExpensesContent } from '@/components/expenses/AdminExpensesContent';
import { SharedCostsContent } from '@/components/expenses/SharedCostsContent';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ExpenseManagementProps {
    searchParams: Promise<{ month?: string; year?: string; query?: string; page?: string; tab?: string }>;
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
    const activeTab = params.tab || 'meal';

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Expense Tracking</h1>
                    <p className="text-gray-500 mt-1">Track daily mess costs and shared expenses.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
                    <AddExpenseModal />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <Link
                    href={`?month=${selectedMonth}&year=${selectedYear}&tab=meal`}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'meal'
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                >
                    Meal Expenses
                </Link>
                <Link
                    href={`?month=${selectedMonth}&year=${selectedYear}&tab=shared`}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'shared'
                            ? "border-purple-600 text-purple-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                >
                    Shared Costs
                </Link>
            </div>

            <Suspense key={`${selectedMonth}-${selectedYear}-${params.query}-${currentPage}-${activeTab}`} fallback={<AdminExpensesSkeleton />}>
                {activeTab === 'meal' ? (
                    <AdminExpensesContent
                        organizationId={organizationId}
                        startDate={startDate}
                        endDate={endDate}
                        currentPage={currentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        searchQuery={params.query}
                    />
                ) : (
                    <SharedCostsContent
                        organizationId={organizationId}
                        startDate={startDate}
                        endDate={endDate}
                        currentPage={currentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        searchQuery={params.query}
                    />
                )}
            </Suspense>
        </div>
    );
}
