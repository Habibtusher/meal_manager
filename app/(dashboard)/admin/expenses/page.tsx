import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { formatCurrency, formatDate, getToday } from '@/lib/utils';
import { Receipt, ShoppingCart, TrendingDown } from 'lucide-react';

import AddExpenseModal from '@/components/expenses/AddExpenseModal';
import EditExpenseModal from '@/components/expenses/EditExpenseModal';
import DeleteExpenseButton from '@/components/expenses/DeleteExpenseButton';
import { MonthPicker } from '@/components/ui/MonthPicker';
import DebouncedSearch from '@/components/ui/DebouncedSearch';

interface ExpenseManagementProps {
    searchParams: Promise<{ month?: string; year?: string; query?: string }>;
}

export default async function ExpenseManagement({ searchParams }: ExpenseManagementProps) {
    const session = await auth();
    if (!session?.user?.organizationId) return null;
    const organizationId = session.user.organizationId;

    const params = await searchParams;
    const now = getToday();
    const selectedMonth = params.month ? parseInt(params.month) : now.getUTCMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getUTCFullYear();

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999));

    const expenses = await prisma.expense.findMany({
        where: {
            organizationId,
            date: {
                gte: startDate,
                lte: endDate
            },
            ...(params.query ? {
                OR: [
                    { description: { contains: params.query, mode: 'insensitive' } },
                    { category: { contains: params.query, mode: 'insensitive' } },
                ]
            } : {})
        },
        orderBy: { date: 'desc' },
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <TrendingDown className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Total Spent</p>
                                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Expense History</CardTitle>
                            <CardDescription>Detailed breakdown of mess expenditures.</CardDescription>
                        </div>
                        <DebouncedSearch
                            defaultValue={params.query}
                            placeholder="Search expenses..."
                            className="w-full md:w-64"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 italic text-gray-400 text-xs">
                                    <th className="pb-4 font-medium uppercase tracking-widest px-4">Date</th>
                                    <th className="pb-4 font-medium uppercase tracking-widest px-4">Description</th>
                                    <th className="pb-4 font-medium uppercase tracking-widest px-4 text-center">Category</th>
                                    <th className="pb-4 font-medium uppercase tracking-widest px-4 text-right">Amount</th>
                                    <th className="pb-4 font-medium uppercase tracking-widest px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {expenses.map((expense) => (
                                    <tr key={expense.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                                            {formatDate(expense.date)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shrink-0">
                                                    {expense.category.toLowerCase().includes('food') ? <ShoppingCart className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{expense.description}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-gray-900 whitespace-nowrap">
                                            {formatCurrency(expense.amount.toString())}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <EditExpenseModal expense={expense} />
                                                <DeleteExpenseButton expenseId={expense.id} description={expense.description} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {expenses.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400 italic">
                                            No expenses logged yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
