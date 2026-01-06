import { auth } from '@/lib/auth';
import { getToday } from '@/lib/utils';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Suspense } from 'react';
import { WalletSkeleton } from '@/components/wallet/WalletSkeleton';
import { WalletContent } from '@/components/wallet/WalletContent';
import prisma from '@/lib/prisma';
import AddDepositModal from '@/components/wallet/AddDepositModal';


interface WalletManagementProps {
    searchParams: Promise<{ month?: string; year?: string; query?: string; page?: string }>;
}

const ITEMS_PER_PAGE = 10;

export default async function WalletManagement({ searchParams }: WalletManagementProps) {
    const session = await auth();
    if (!session?.user?.organizationId) return null;
    const organizationId = session.user.organizationId;

    const params = await searchParams;
    const now = getToday();
    const selectedMonth = params.month ? parseInt(params.month) : now.getUTCMonth() + 1;
    const selectedYear = params.year ? parseInt(params.year) : now.getUTCFullYear();
    const currentPage = Math.max(1, parseInt(params.page || '1') || 1);

    const [members] = await Promise.all([
        prisma.user.findMany({
            where: { organizationId, role: { in: ['MEMBER', 'ADMIN'] }, isActive: true },
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' },
        })
    ]);

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Wallet Transactions</h1>
                    <p className="text-gray-500 mt-1">Manage deposits and track system-wide transactions.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <MonthPicker defaultMonth={selectedMonth} defaultYear={selectedYear} />
                    <AddDepositModal members={members} />
                </div>
            </div>

            <Suspense key={`${selectedMonth}-${selectedYear}-${params.query}-${currentPage}`} fallback={<WalletSkeleton />}>
                <WalletContent
                    organizationId={organizationId as string}
                    startDate={startDate}
                    endDate={endDate}
                    currentPage={currentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    searchQuery={params.query}
                />
            </Suspense>
        </div>
    );
}
