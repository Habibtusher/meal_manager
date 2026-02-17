import { getWalletData } from "@/lib/services/wallet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import { Wallet, ArrowUpCircle } from "lucide-react";
import DebouncedSearch from "@/components/ui/DebouncedSearch";
import AddDepositModal from "@/components/wallet/AddDepositModal";
import EditTransactionModal from "@/components/wallet/EditTransactionModal";
import DeleteTransactionButton from "@/components/wallet/DeleteTransactionButton";
import { Pagination } from "@/components/ui/Pagination";

interface WalletContentProps {
    organizationId: string;
    startDate: Date;
    endDate: Date;
    currentPage: number;
    itemsPerPage: number;
    searchQuery?: string;
}

export async function WalletContent({
    organizationId,
    startDate,
    endDate,
    currentPage,
    itemsPerPage,
    searchQuery
}: WalletContentProps) {
    const { totalCount, transactions, members, totalDeposits, systemLiability, netMonthlyChange, newerTransactionsSum } = await getWalletData(
        organizationId,
        startDate,
        endDate,
        (currentPage - 1) * itemsPerPage,
        itemsPerPage,
        searchQuery
    );

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // Calculate monthly running balances for the current page
    let currentMonthlyBalance = netMonthlyChange - newerTransactionsSum;
    const transactionsWithMonthlyBalance = transactions.map((tx) => {
        const balance = currentMonthlyBalance;
        // Since transactions are DESC, we subtract for the next (older) one
        const amount = Number(tx.amount);
        currentMonthlyBalance -= (tx.type === 'CREDIT' ? amount : -amount);
        return { ...tx, monthlyBalance: balance };
    });

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-80">Total Deposits</p>
                                <p className="text-3xl font-bold mt-1">{formatCurrency(totalDeposits)}</p>
                                <p className="text-xs mt-2 text-green-100 flex items-center gap-1">
                                    <ArrowUpCircle className="w-3 h-3" /> Selected Month
                                </p>
                            </div>
                            <Wallet className="w-12 h-12 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">System Liability</p>
                                <p className="text-3xl font-bold text-foreground mt-1">{formatCurrency(systemLiability)}</p>
                                <p className="text-xs mt-2 text-muted-foreground">Sum of all active wallet balances</p>
                            </div>
                            <Wallet className="w-12 h-12 text-muted" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Comprehensive log of all money moves.</CardDescription>
                        </div>
                        <DebouncedSearch
                            defaultValue={searchQuery}
                            placeholder="Search logs..."
                            className="w-full md:w-64"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border italic text-muted-foreground text-sm">
                                    <th className="pb-4 font-medium">User & Details</th>
                                    <th className="pb-4 font-medium text-center">Type</th>
                                    <th className="pb-4 font-medium">Description</th>
                                    <th className="pb-4 font-medium text-right">Amount</th>
                                    <th className="pb-4 font-medium text-right">Monthly Balance</th>
                                    <th className="pb-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {transactionsWithMonthlyBalance.map((tx) => (
                                    <tr key={tx.id} className="text-sm group hover:bg-muted/50 transition-colors">
                                        <td className="py-4">
                                            <div>
                                                <p className="font-bold text-foreground">{tx.user.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-mono">{formatDateTime(tx.createdAt)}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className={cn(
                                                'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest',
                                                tx.type === 'CREDIT' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
                                            )}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="py-4 italic text-muted-foreground">
                                            {tx.description}
                                        </td>
                                        <td className={cn(
                                            'py-4 text-right font-bold',
                                            tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-500'
                                        )}>
                                            {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount.toString())}
                                        </td>
                                        <td className="py-4 text-right font-medium text-muted-foreground">
                                            {formatCurrency(tx.monthlyBalance.toString())}
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <EditTransactionModal transaction={tx} />
                                                <DeleteTransactionButton transactionId={tx.id} description={tx.description} userName={tx.user.name} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-muted-foreground italic">No transactions found.</td>
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
