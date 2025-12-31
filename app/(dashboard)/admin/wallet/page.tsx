import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDateTime, getToday, cn } from '@/lib/utils';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';

import AddDepositModal from '@/components/wallet/AddDepositModal';
import EditTransactionModal from '@/components/wallet/EditTransactionModal';
import DeleteTransactionButton from '@/components/wallet/DeleteTransactionButton';
import { MonthPicker } from '@/components/ui/MonthPicker';

interface WalletManagementProps {
    searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function WalletManagement({ searchParams }: WalletManagementProps) {
    const session = await auth();
    const organizationId = session?.user.organizationId!;

    const params = await searchParams;
    const now = getToday();
    const selectedMonth = params.month ? parseInt(params.month) : now.getUTCMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getUTCFullYear();

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999));

    const [transactions, members, stats] = await Promise.all([
        prisma.walletTransaction.findMany({
            where: {
                organizationId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } },
        }),
        prisma.user.findMany({
            where: { organizationId, role: { in: ['MEMBER', 'ADMIN'] }, isActive: true },
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' },
        }),
        prisma.$transaction([
            prisma.walletTransaction.aggregate({
                where: { organizationId, type: 'CREDIT', createdAt: { gte: startDate, lte: endDate } },
                _sum: { amount: true }
            }),
            prisma.user.aggregate({
                where: { organizationId },
                _sum: { walletBalance: true }
            })
        ])
    ]);

    const totalDeposits = stats[0]._sum.amount || 0;
    const systemLiability = stats[1]._sum.walletBalance || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Wallet Transactions</h1>
                    <p className="text-gray-500 mt-1">Manage deposits and track system-wide transactions.</p>
                </div>
                <div className="flex gap-2">
                    <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
                    <AddDepositModal members={members} />
                </div>
            </div>

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
                                <p className="text-sm font-medium text-gray-500">System Liability</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(systemLiability)}</p>
                                <p className="text-xs mt-2 text-gray-400">Sum of all active wallet balances</p>
                            </div>
                            <Wallet className="w-12 h-12 text-gray-100" />
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
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input placeholder="Search logs..." className="pl-10 h-9 text-sm" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 italic text-gray-400 text-sm">
                                    <th className="pb-4 font-medium">User & Details</th>
                                    <th className="pb-4 font-medium text-center">Type</th>
                                    <th className="pb-4 font-medium">Description</th>
                                    <th className="pb-4 font-medium text-right">Amount</th>
                                    <th className="pb-4 font-medium text-right">Balance After</th>
                                    <th className="pb-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.map((tx: any) => (
                                    <tr key={tx.id} className="text-sm group">
                                        <td className="py-4">
                                            <div>
                                                <p className="font-bold text-gray-900">{tx.user.name}</p>
                                                <p className="text-[10px] text-gray-400 font-mono">{formatDateTime(tx.createdAt)}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className={cn(
                                                'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest',
                                                tx.type === 'CREDIT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            )}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="py-4 italic text-gray-600">
                                            {tx.description}
                                        </td>
                                        <td className={cn(
                                            'py-4 text-right font-bold',
                                            tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-500'
                                        )}>
                                            {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount.toString())}
                                        </td>
                                        <td className="py-4 text-right font-medium text-gray-400">
                                            {formatCurrency(tx.balanceAfter.toString())}
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
                                        <td colSpan={5} className="py-12 text-center text-gray-500 italic">No transactions found.</td>
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
