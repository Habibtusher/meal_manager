import { getAdminDashboardStats } from "@/lib/services/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AdminLowBalanceAlertsProps {
    organizationId: string;
    month: number;
    year: number;
}

export async function AdminLowBalanceAlerts({ organizationId, month, year }: AdminLowBalanceAlertsProps) {
    const { lowBalanceUsers } = await getAdminDashboardStats(organizationId, month, year);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Low Balance Alerts
                    </CardTitle>
                    <CardDescription>Users with monthly balance below ৳200</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {lowBalanceUsers.length > 0 ? (
                        lowBalanceUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-red-600">{formatCurrency(user.walletBalance)}</p>
                                    <button className="text-[10px] text-blue-600 hover:underline font-medium">Inform User</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No users with low balance.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
