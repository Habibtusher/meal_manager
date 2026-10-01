'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { 
  X, 
  Lock, 
  CheckCircle, 
  Calendar, 
  UserCheck, 
  UserMinus, 
  FileText,
  FileSpreadsheet
} from 'lucide-react';

interface SettlementDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: number;
  year: number;
  settlement: any;
  members: any[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function SettlementDetailsModal({
  isOpen,
  onClose,
  month,
  year,
  settlement,
  members,
}: SettlementDetailsModalProps) {
  if (!isOpen || !settlement) return null;

  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;
  const closedDateStr = settlement.closedAt
    ? new Date(settlement.closedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const memberSettlements = settlement.memberSettlements || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">
                  Settlement Record — {monthLabel}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Locked & Settled
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Closed on {closedDateStr}
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Locked Meal Rate</p>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {formatCurrency(settlement.mealRate)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Expenses</p>
              <p className="text-xl font-black text-red-600 dark:text-red-400 mt-1">
                {formatCurrency(settlement.totalExpenses)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Meals</p>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {settlement.totalMeals}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Members Settled</p>
              <p className="text-xl font-black text-foreground mt-1">
                {memberSettlements.length}
              </p>
            </div>
          </div>

          {/* Notes (if any) */}
          {settlement.notes && (
            <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-start gap-2.5 text-xs">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Settlement Notes:</span>
                <p className="text-muted-foreground mt-0.5">{settlement.notes}</p>
              </div>
            </div>
          )}

          {/* Table */}
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
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4">Action Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {memberSettlements.map((ms: any) => {
                    const memberInfo = members.find((m) => m.id === ms.userId);
                    const name = memberInfo?.name || ms.userId;
                    const isSurplus = ms.netBalance > 0.01;
                    const isDue = ms.netBalance < -0.01;

                    return (
                      <tr key={ms.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          {name}
                        </td>
                        <td className="py-3.5 px-3 text-center font-medium text-muted-foreground">
                          {ms.mealsConsumed}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-muted-foreground">
                          {formatCurrency(ms.totalCost)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-muted-foreground">
                          {formatCurrency(ms.totalDeposited)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {isSurplus && (
                            <span className="font-bold text-green-600 dark:text-green-400">
                              +{formatCurrency(ms.netBalance)}
                            </span>
                          )}
                          {isDue && (
                            <span className="font-bold text-red-600 dark:text-red-400">
                              {formatCurrency(ms.netBalance)}
                            </span>
                          )}
                          {!isSurplus && !isDue && (
                            <span className="text-muted-foreground">৳0.00</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {ms.isContinuing ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                              <UserCheck className="w-3 h-3" />
                              Staying
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded">
                              <UserMinus className="w-3 h-3" />
                              Exited Mess
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {ms.actionTaken === 'CARRY_FORWARD' && (
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              Carried forward into next month
                            </span>
                          )}
                          {ms.actionTaken === 'REFUNDED' && (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              Refunded {formatCurrency(ms.actionAmount)} & Deactivated
                            </span>
                          )}
                          {ms.actionTaken === 'DUE_PAID' && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              Collected {formatCurrency(ms.actionAmount)} due & Deactivated
                            </span>
                          )}
                          {ms.actionTaken === 'DUE_FORGIVEN' && (
                            <span className="text-red-500 font-medium">
                              Due Forgiven ({formatCurrency(ms.actionAmount)}) & Deactivated
                            </span>
                          )}
                          {ms.actionTaken === 'BALANCED' && (
                            <span className="text-muted-foreground">
                              Balanced at ৳0
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 px-6 border-t border-border bg-muted/40">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
