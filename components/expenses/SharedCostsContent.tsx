import { getOrganizationSharedCosts } from "@/lib/services/shared-costs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, TrendingDown } from "lucide-react";
import EditSharedCostModal from "@/components/expenses/EditSharedCostModal";
import DeleteSharedCostButton from "@/components/expenses/DeleteSharedCostButton";
import DebouncedSearch from "@/components/ui/DebouncedSearch";
import { Pagination } from "@/components/ui/Pagination";

interface SharedCostsContentProps {
    organizationId: string;
    startDate: Date;
    endDate: Date;
    currentPage: number;
    itemsPerPage: number;
    searchQuery?: string;
}

export async function SharedCostsContent({
    organizationId,
    startDate,
    endDate,
    currentPage,
    itemsPerPage,
    searchQuery
}: SharedCostsContentProps) {
    const { sharedCosts, totalCount, totalSpent } = await getOrganizationSharedCosts({
        organizationId,
        startDate,
        endDate,
        offset: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
        searchQuery
    });

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingDown className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Total Shared Costs</p>
                                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Shared Costs History</CardTitle>
                            <CardDescription>Utilities, rent, and other shared expenses.</CardDescription>
                        </div>
                        <DebouncedSearch
                            defaultValue={searchQuery}
                            placeholder="Search shared costs..."
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
                                    <th className="pb-4 font-medium uppercase tracking-widest px-4 text-center">Members</th>
                                    <th className="pb-4 font-medium uppercase tracking-widest px-4 text-right">Amount</th>
                                    <th className="pb-4 font-medium uppercase tracking-widest px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sharedCosts.map((cost: any) => (
                                    <tr key={cost.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                                            {formatDate(cost.date)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-500 transition-colors shrink-0">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{cost.description}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-purple-500 bg-purple-50 px-2 py-0.5 rounded">
                                                {cost.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center text-sm text-gray-600">
                                            {cost.allocations?.length || 0}
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-gray-900 whitespace-nowrap">
                                            {formatCurrency(cost.amount.toString())}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <EditSharedCostModal sharedCost={cost} />
                                                <DeleteSharedCostButton sharedCostId={cost.id} description={cost.description} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {sharedCosts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-400 italic">
                                            No shared costs logged yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
