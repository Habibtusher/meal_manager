import { getOrganizationExpenses } from "@/lib/services/expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShoppingCart, Receipt } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";

interface ExpensesContentProps {
    organizationId: string;
    startDate: Date;
    endDate: Date;
    currentPage: number;
    itemsPerPage: number;
}

export async function ExpensesContent({
    organizationId,
    startDate,
    endDate,
    currentPage,
    itemsPerPage
}: ExpensesContentProps) {
    const { expenses, totalCount, totalSpent } = await getOrganizationExpenses(
        organizationId,
        startDate,
        endDate,
        (currentPage - 1) * itemsPerPage,
        itemsPerPage
    );

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
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
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalCount}
                        itemsPerPage={itemsPerPage}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
