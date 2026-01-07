import { getLatestExpenses } from "@/lib/services/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ShoppingCart } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface RecentExpensesProps {
    organizationId: string;
    viewAllLink: string;
}

export async function RecentExpenses({ organizationId, viewAllLink }: RecentExpensesProps) {
    const latestExpenses = await getLatestExpenses(organizationId);

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg">Latest Expenses</CardTitle>
                    <CardDescription>Recent organization expenditures</CardDescription>
                </div>
                <Link href={viewAllLink}>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-bold">
                        View More
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {latestExpenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                    <ShoppingCart className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{expense.description}</p>
                                    <p className="text-[10px] text-gray-400">{formatDate(expense.date)}</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                        </div>
                    ))}
                    {latestExpenses.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No recent expenses.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
