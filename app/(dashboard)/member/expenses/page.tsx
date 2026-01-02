import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ShoppingCart, Receipt } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

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
    const currentPage = params.page ? parseInt(params.page) : 1;
    const pageSize = 10;

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

    // Fetch data in parallel
    const [expenses, totalCount, stats] = await Promise.all([
        prisma.expense.findMany({
            where: {
                organizationId,
                date: { gte: startDate, lte: endDate },
            },
            orderBy: { date: 'desc' },
            skip: (currentPage - 1) * pageSize,
            take: pageSize,
        }),
        prisma.expense.count({
            where: {
                organizationId,
                date: { gte: startDate, lte: endDate },
            },
        }),
        prisma.expense.aggregate({
            where: {
                organizationId,
                date: { gte: startDate, lte: endDate },
            },
            _sum: { amount: true },
        }),
    ]);

    const totalSpent = stats._sum.amount || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Organization Expenses</h1>
                    <p className="text-gray-500 mt-1">View the latest expenditures for your organization.</p>
                </div>
                <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-50 rounded-2xl">
                                <Receipt className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Organization Spent</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Recent Expenses</CardTitle>
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {expenses.map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                            <ShoppingCart className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{expense.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium uppercase">
                                                    {expense.category}
                                                </span>
                                                <p className="text-[10px] text-gray-400">{formatDate(expense.date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                                </div>
                            ))}
                            {expenses.length === 0 && (
                                <div className="text-center py-12">
                                    <Receipt className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-500">No expenses found for this period.</p>
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <Link 
                                        href={`/member/expenses?month=${selectedMonth}&year=${selectedYear}&page=${currentPage - 1}`}
                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                    >
                                        <Button variant="outline" size="sm">Previous</Button>
                                    </Link>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <Link 
                                                key={p} 
                                                href={`/member/expenses?month=${selectedMonth}&year=${selectedYear}&page=${p}`}
                                            >
                                                <Button 
                                                    variant={p === currentPage ? 'default' : 'outline'} 
                                                    size="sm"
                                                    className="w-8"
                                                >
                                                    {p}
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link 
                                        href={`/member/expenses?month=${selectedMonth}&year=${selectedYear}&page=${currentPage + 1}`}
                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                    >
                                        <Button variant="outline" size="sm">Next</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
