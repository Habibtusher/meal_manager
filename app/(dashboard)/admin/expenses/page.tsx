import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate, getToday } from '@/lib/utils';
import { Plus, Receipt, ShoppingCart, TrendingDown } from 'lucide-react';

import AddExpenseModal from '@/components/expenses/AddExpenseModal';
import EditExpenseModal from '@/components/expenses/EditExpenseModal';
import DeleteExpenseButton from '@/components/expenses/DeleteExpenseButton';
import { MonthPicker } from '@/components/ui/MonthPicker';

interface ExpenseManagementProps {
    searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function ExpenseManagement({ searchParams }: ExpenseManagementProps) {
    const session = await auth();
    const organizationId = session?.user.organizationId!;

    const params = await searchParams;
    const now = getToday();
    const selectedMonth = params.month ? parseInt(params.month) : now.getMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

    const expenses = await prisma.expense.findMany({
        where: {
            organizationId,
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: { date: 'desc' },
    });

    const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Expense Tracking</h1>
                    <p className="text-gray-500 mt-1">Track daily mess costs and inventory purchases.</p>
                </div>
                <div className="flex gap-2">
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
                    <CardTitle>Expense History</CardTitle>
                    <CardDescription>Detailed breakdown of mess expenditures.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {expenses.map((expense: any) => (
                            <div key={expense.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        {expense.category.toLowerCase().includes('food') ? <ShoppingCart className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{expense.description}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">{expense.category}</span>
                                            <span className="text-xs text-gray-400">{formatDate(expense.date)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <p className="text-base font-bold text-gray-900 mr-2">{formatCurrency(expense.amount.toString())}</p>
                                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <EditExpenseModal expense={expense} />
                                        <DeleteExpenseButton expenseId={expense.id} description={expense.description} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {expenses.length === 0 && (
                            <div className="py-20 text-center text-gray-400 italic">No expenses logged yet.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
