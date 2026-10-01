'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { formatCurrency, cn } from '@/lib/utils';
import { closeAndSettleMonth, MemberSettlementDecision } from '@/lib/actions/settlement';
import { Button } from '@/components/ui/Button';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Lock, 
  UserCheck, 
  UserMinus, 
  DollarSign, 
  Calendar, 
  Info,
  Banknote
} from 'lucide-react';

interface MemberData {
  id: string;
  name: string;
  mealsConsumed: number;
  totalCost: number;
  totalDeposited: number;
  adjustedBalance: number;
  isActive: boolean;
}

interface MonthSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: number;
  year: number;
  totalExpenses: number;
  totalMeals: number;
  mealRate: number;
  members: MemberData[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthSettlementModal({
  isOpen,
  onClose,
  month,
  year,
  totalExpenses,
  totalMeals,
  mealRate,
  members,
}: MonthSettlementModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [notes, setNotes] = useState('');

  // Initial decisions state
  const [decisions, setDecisions] = useState<Record<string, {
    isContinuing: boolean;
    actionTaken: 'CARRY_FORWARD' | 'REFUNDED' | 'DUE_PAID' | 'DUE_FORGIVEN' | 'BALANCED';
    actionAmount: number;
  }>>(() => {
    const initial: Record<string, any> = {};
    members.forEach((m) => {
      const isBalanced = Math.abs(m.adjustedBalance) < 0.01;
      initial[m.id] = {
        isContinuing: true,
        actionTaken: isBalanced ? 'BALANCED' : 'CARRY_FORWARD',
        actionAmount: Math.abs(m.adjustedBalance),
      };
    });
    return initial;
  });

  if (!isOpen) return null;

  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonthLabel = `${MONTH_NAMES[nextMonth - 1]} ${nextYear}`;

  const handleStatusChange = (userId: string, isContinuing: boolean) => {
    setDecisions((prev) => {
      const member = members.find((m) => m.id === userId);
      const bal = member?.adjustedBalance || 0;
      let action: any = 'CARRY_FORWARD';

      if (isContinuing) {
        action = Math.abs(bal) < 0.01 ? 'BALANCED' : 'CARRY_FORWARD';
      } else {
        if (bal > 0.01) action = 'REFUNDED';
        else if (bal < -0.01) action = 'DUE_PAID';
        else action = 'BALANCED';
      }

      return {
        ...prev,
        [userId]: {
          ...prev[userId],
          isContinuing,
          actionTaken: action,
        },
      };
    });
  };

  const handleActionChange = (userId: string, actionTaken: any) => {
    setDecisions((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        actionTaken,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      toast.error('Please confirm the settlement review checkbox first.');
      return;
    }

    setLoading(true);
    try {
      const decisionList: MemberSettlementDecision[] = members.map((m) => {
        const d = decisions[m.id];
        return {
          userId: m.id,
          isContinuing: d?.isContinuing ?? true,
          actionTaken: d?.actionTaken ?? 'CARRY_FORWARD',
          actionAmount: Math.abs(m.adjustedBalance),
        };
      });

      const res = await closeAndSettleMonth({
        month,
        year,
        notes: notes.trim() || undefined,
        decisions: decisionList,
      });

      if (res.success) {
        toast.success(`${monthLabel} has been successfully closed & settled!`);
        onClose();
        router.refresh();
      } else {
        toast.error(res.error || 'Failed to settle month.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const totalSurplus = members
    .filter((m) => m.adjustedBalance > 0)
    .reduce((sum, m) => sum + m.adjustedBalance, 0);

  const totalDues = members
    .filter((m) => m.adjustedBalance < 0)
    .reduce((sum, m) => sum + Math.abs(m.adjustedBalance), 0);

  const continuingCount = Object.values(decisions).filter((d) => d.isContinuing).length;
  const leavingCount = members.length - continuingCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Month-End Settlement & Lock — {monthLabel}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review member final balances, resolve exits or carry over to {nextMonthLabel}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Final Meal Rate</p>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">{formatCurrency(mealRate)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{totalExpenses} tk / {totalMeals} meals</p>
            </div>
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Total Surplus</p>
              <p className="text-xl font-black text-green-600 dark:text-green-400 mt-1">{formatCurrency(totalSurplus)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Extra money with members</p>
            </div>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Total Member Dues</p>
              <p className="text-xl font-black text-red-600 dark:text-red-400 mt-1">{formatCurrency(totalDues)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Unpaid dues owed to mess</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Member Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {continuingCount} Staying
                </span>
                {leavingCount > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                    {leavingCount} Leaving
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Total: {members.length} members</p>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-semibold text-sm">How Month-End Settlement works:</p>
              <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground dark:text-blue-200/80">
                <li><strong>Staying members:</strong> Surplus is automatically credited on {nextMonthLabel} 1st as opening balance. Dues are carried over as opening due.</li>
                <li><strong>Leaving members:</strong> Final cash refund or due collection will settle their balance to zero, and their account will be deactivated from next month.</li>
                <li><strong>Data Safety:</strong> Once locked, {monthLabel} records cannot be accidentally modified.</li>
              </ul>
            </div>
          </div>

          {/* Members Settlement Table */}
          <div className="border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/70 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-3 text-center">Meals</th>
                    <th className="py-3 px-3 text-right">Total Cost</th>
                    <th className="py-3 px-3 text-right">Deposited</th>
                    <th className="py-3 px-4 text-right">Net Balance</th>
                    <th className="py-3 px-4 text-center">Next Month Status</th>
                    <th className="py-3 px-4">Settlement Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {members.map((member) => {
                    const decision = decisions[member.id] || { isContinuing: true, actionTaken: 'CARRY_FORWARD' };
                    const isSurplus = member.adjustedBalance > 0.01;
                    const isDue = member.adjustedBalance < -0.01;
                    const isBalanced = !isSurplus && !isDue;

                    return (
                      <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          {member.name}
                        </td>
                        <td className="py-3.5 px-3 text-center font-medium text-muted-foreground">
                          {member.mealsConsumed}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-muted-foreground">
                          {formatCurrency(member.totalCost)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-muted-foreground">
                          {formatCurrency(member.totalDeposited)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {isSurplus && (
                            <span className="inline-flex items-center gap-1 font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                              +{formatCurrency(member.adjustedBalance)}
                              <span className="text-[10px] font-normal uppercase">Extra</span>
                            </span>
                          )}
                          {isDue && (
                            <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">
                              {formatCurrency(member.adjustedBalance)}
                              <span className="text-[10px] font-normal uppercase">Due</span>
                            </span>
                          )}
                          {isBalanced && (
                            <span className="font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                              ৳0.00
                            </span>
                          )}
                        </td>

                        {/* Status Toggle: Continuing vs Leaving */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex rounded-lg p-0.5 bg-muted border border-border">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(member.id, true)}
                              className={cn(
                                'flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all',
                                decision.isContinuing
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground'
                              )}
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              Staying
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(member.id, false)}
                              className={cn(
                                'flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all',
                                !decision.isContinuing
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground'
                              )}
                            >
                              <UserMinus className="w-3.5 h-3.5" />
                              Leaving
                            </button>
                          </div>
                        </td>

                        {/* Action Details */}
                        <td className="py-3.5 px-4">
                          {decision.isContinuing ? (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              {isSurplus && (
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  ➡️ Carry forward as <strong>Opening Credit</strong> on {nextMonthLabel} 1st
                                </span>
                              )}
                              {isDue && (
                                <span className="text-red-500 dark:text-red-400 font-medium">
                                  ➡️ Carry forward as <strong>Opening Due</strong> in {nextMonthLabel}
                                </span>
                              )}
                              {isBalanced && (
                                <span className="text-muted-foreground">
                                  No adjustment needed (Balanced)
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {isSurplus && (
                                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">
                                  <Banknote className="w-3.5 h-3.5" />
                                  Refund {formatCurrency(member.adjustedBalance)} & Deactivate
                                </span>
                              )}
                              {isDue && (
                                <select
                                  value={decision.actionTaken}
                                  onChange={(e) => handleActionChange(member.id, e.target.value)}
                                  className="text-xs bg-card border border-border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="DUE_PAID">
                                    Collect {formatCurrency(Math.abs(member.adjustedBalance))} Cash & Exit
                                  </option>
                                  <option value="DUE_FORGIVEN">
                                    Forgive Due (Bad Debt) & Exit
                                  </option>
                                </select>
                              )}
                              {isBalanced && (
                                <span className="text-muted-foreground">
                                  Deactivate account upon exit
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes & Confirmation */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Settlement Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Month accounts verified and settled by Manager."
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <input
                type="checkbox"
                id="confirmSettlement"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="confirmSettlement" className="text-xs text-foreground cursor-pointer select-none">
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  I confirm that all expenses, meals, and member balances have been audited.
                </span>{' '}
                Closing this month will lock records and roll forward balances into {nextMonthLabel}.
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-border bg-muted/40">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            isLoading={loading}
            disabled={!confirmed || loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Lock className="w-4 h-4" />
            Execute Settlement & Lock {monthLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
