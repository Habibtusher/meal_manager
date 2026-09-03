import { getMemberDashboardStats } from "@/lib/services/member";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertCircle, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MemberNotificationsProps {
    userId: string;
    organizationId: string;
    month: number;
    year: number;
}

export async function MemberNotifications({ userId, organizationId, month, year }: MemberNotificationsProps) {
    const { totalDeposited, monthlyCost, totalSharedCost, totalCost, adjustedBalance } = await getMemberDashboardStats(userId, organizationId, month, year);

    const isLowBalance = adjustedBalance < 200;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-indigo-500" />
                    Balance Overview
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Balance Breakdown */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">Total Deposited</span>
                        <span className="text-sm font-semibold text-green-600">{formatCurrency(totalDeposited)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">Meal Cost</span>
                        <span className="text-sm font-medium text-red-500">{formatCurrency(monthlyCost)}</span>
                    </div>
                    {totalSharedCost > 0 && (
                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                            <span className="text-sm text-muted-foreground">Shared Cost</span>
                            <span className="text-sm font-medium text-red-500">{formatCurrency(totalSharedCost)}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground font-medium">Total Cost</span>
                        <span className="text-sm font-semibold text-red-500">{formatCurrency(totalCost)}</span>
                    </div>
                </div>

                {/* Adjusted Balance */}
                <div className={`p-4 rounded-xl text-center ${isLowBalance ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Adjusted Balance</p>
                    <p className={`text-2xl font-bold ${isLowBalance ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(adjustedBalance)}
                    </p>
                </div>

                {/* Low Balance Warning */}
                {isLowBalance && (
                    <div className="flex items-start gap-3 p-3 bg-red-500/10 text-red-600 rounded-lg text-sm border border-red-500/20">
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p>Your balance is low. Please deposit cash to continue tracking meals smoothly.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

