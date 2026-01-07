import { getMemberDashboardStats } from "@/lib/services/member";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertCircle } from "lucide-react";

interface MemberNotificationsProps {
    userId: string;
    organizationId: string;
    month: number;
    year: number;
}

export async function MemberNotifications({ userId, organizationId, month, year }: MemberNotificationsProps) {
    const { userBalance } = await getMemberDashboardStats(userId, organizationId, month, year);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {userBalance < 200 && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p>Your wallet balance is low. Please deposit cash to continue tracking meals smoothly.</p>
                    </div>
                )}
                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                    Welcome to your new Meal Manager dashboard!
                </div>
            </CardContent>
        </Card>
    );
}
