import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { formatCurrency, formatDate, getToday } from '@/lib/utils';
import { Receipt, ShoppingCart, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthPicker } from '@/components/ui/MonthPicker';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface MemberExpensesProps {
    searchParams: Promise<{ month?: string; year?: string; page?: string }>;
}

export default async function MemberExpenses({ searchParams }: MemberExpensesProps) {
    const session = await auth();
    const organizationId = session?.user.organizationId!;

    const params = await searchParams;
    const now = getToday();
    const selectedMonth = params.month ? parseInt(params.month) : now.getUTCMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getUTCFullYear();
    const currentPage = params.page ? parseInt(params.page) : 1;
    const pageSize = 10;

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999));

    // Fetch total count for pagination
    const totalCount = await prisma.expense.count({
        where: {
            organizationId,
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    const expenses = await prisma.expense.findMany({
        where: {
            organizationId,
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: { date: 'desc' },
        skip: (currentPage - 1) * pageSize,
        take: pageSize
    });

    const totalExpenses = await prisma.expense.aggregate({
        where: {
            organizationId,
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        _sum: { amount: true }
    });

    const totalSpent = totalExpenses._sum.amount || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Organization Expenses</h1>
                    <p className="text-gray-500 mt-1">View daily mess costs and expenditures for your organization.</p>
                </div>
                <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <TrendingDown className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Total Organization Spent</p>
                                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Expense History</CardTitle>
                    <CardDescription>Records for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</CardDescription>
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
                                <p className="text-base font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                            </div>
                        ))}
                        {expenses.length === 0 && (
                            <div className="py-20 text-center text-gray-400 italic">No expenses found for this period.</div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Link href={`/member/expenses?month=${selectedMonth}&year=${selectedYear}&page=${Math.max(1, currentPage - 1)}`}>
                                <Button variant="ghost" size="sm" disabled={currentPage <= 1}>
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                                </Button>
                            </Link>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <Link key={p} href={`/member/expenses?month=${selectedMonth}&year=${selectedYear}&page=${p}`}>
                                        <Button
                                            variant={p === currentPage ? 'primary' : 'ghost'}
                                            size="sm"
                                            className="w-8 h-8 p-0"
                                        >
                                            {p}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                            <Link href={`/member/expenses?month=${selectedMonth}&year=${selectedYear}&page=${Math.min(totalPages, currentPage + 1)}`}>
                                <Button variant="ghost" size="sm" disabled={currentPage >= totalPages}>
                                    Next <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
