'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import MonthSettlementModal from './MonthSettlementModal';
import SettlementDetailsModal from './SettlementDetailsModal';
import { reopenMonthSettlement } from '@/lib/actions/settlement';
import { 
  Lock, 
  Unlock, 
  CheckCircle, 
  Calendar, 
  Eye, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface MonthSettlementBannerProps {
  month: number;
  year: number;
  isSettled: boolean;
  settlement: any;
  totalExpenses: number;
  totalMeals: number;
  mealRate: number;
  members: any[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthSettlementBanner({
  month,
  year,
  isSettled,
  settlement,
  totalExpenses,
  totalMeals,
  mealRate,
  members,
}: MonthSettlementBannerProps) {
  const router = useRouter();
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [reopening, setReopening] = useState(false);

  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  const handleReopen = async () => {
    if (!settlement?.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to reopen ${monthLabel}?\n\nThis will remove any carryover transactions that were added to next month and unlock records for editing.`
    );
    if (!confirmed) return;

    setReopening(true);
    try {
      const res = await reopenMonthSettlement(settlement.id);
      if (res.success) {
        toast.success(`${monthLabel} settlement has been reopened.`);
        router.refresh();
      } else {
        toast.error(res.error || 'Failed to reopen settlement.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred.');
    } finally {
      setReopening(false);
    }
  };

  return (
    <>
      {isSettled ? (
        /* CLOSED & SETTLED BANNER */
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-blue-500/10 border border-emerald-500/20 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    {monthLabel} is Closed & Settled
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                    Locked
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Accounts have been audited and finalized. Final Meal Rate:{' '}
                  <span className="font-bold text-foreground">{formatCurrency(settlement?.mealRate || mealRate)}</span>.
                  Records are protected from accidental modifications.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailsModalOpen(true)}
                className="flex items-center gap-1.5 text-xs bg-background"
              >
                <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                View Settlement Details
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReopen}
                isLoading={reopening}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                title="Reopen this month if you need to fix a calculation mistake"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reopen
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ACTIVE / OPEN BANNER */
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 border border-blue-500/20 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    {monthLabel} Settlement — Status: Active / Open
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    Pending Settlement
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  When the month ends, close and settle accounts to carry forward member surplus/dues or refund leaving members.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsSettlementModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md self-end md:self-center font-bold text-xs"
            >
              <Lock className="w-4 h-4" />
              Close & Settle Month
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Settlement Execution Modal */}
      <MonthSettlementModal
        isOpen={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
        month={month}
        year={year}
        totalExpenses={totalExpenses}
        totalMeals={totalMeals}
        mealRate={mealRate}
        members={members}
      />

      {/* Settlement Record Snapshot Modal */}
      <SettlementDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        month={month}
        year={year}
        settlement={settlement}
        members={members}
      />
    </>
  );
}
