import { getAdminDashboardStats } from "@/lib/services/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { LowBalanceAlertButton } from "./LowBalanceAlertButton";

const LOW_BALANCE_THRESHOLD = 200;

interface AdminLowBalanceAlertsProps {
    organizationId: string;
    month: number;
    year: number;
}

export async function AdminLowBalanceAlerts({ organizationId, month, year }: AdminLowBalanceAlertsProps) {
    const { membersWithBalance } = await getAdminDashboardStats(organizationId, month, year);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Member Balance Overview
                    </CardTitle>
                    <CardDescription>All members — alert for adjusted balance below ৳{LOW_BALANCE_THRESHOLD}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {membersWithBalance.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Member</th>
                                    <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Total Deposit</th>
                                    <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Total Cost</th>
                                    <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Adjusted Balance</th>
                                    <th className="text-center py-2 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {membersWithBalance.map((user) => {
                                    const isLowBalance = user.adjustedBalance < LOW_BALANCE_THRESHOLD;
                                    return (
                                        <tr
                                            key={user.id}
                                            className={`border-b border-border/50 last:border-0 ${isLowBalance ? 'bg-red-500/10' : ''}`}
                                        >
                                            <td className="py-3 px-3">
                                                <p className="font-medium text-foreground">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </td>
                                            <td className="py-3 px-3 text-right text-foreground">
                                                {formatCurrency(user.totalDeposited)}
                                            </td>
                                            <td className="py-3 px-3 text-right text-red-500">
                                                {formatCurrency(user.totalCost)}
                                            </td>
                                            <td className={`py-3 px-3 text-right font-bold ${isLowBalance ? 'text-red-600' : 'text-green-600'}`}>
                                                {formatCurrency(user.adjustedBalance)}
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                {isLowBalance && (
                                                    <LowBalanceAlertButton userId={user.id} userName={user.name} />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No members found.</p>
                )}
            </CardContent>
        </Card>
    );
}
