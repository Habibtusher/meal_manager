import { getRecentOrganizations } from "@/lib/services/super-admin";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export async function RecentOrganizationsList() {
    const recentOrgs = await getRecentOrganizations(5);

    return (
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Recent Organizations
                </h3>
                <Link
                    href="/super-admin/organizations"
                    className="text-sm text-primary font-medium hover:underline inline-flex items-center"
                >
                    View All
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase">Org Name</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase">Users</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {recentOrgs.map((org: any) => (
                            <tr key={org.id} className="hover:bg-muted/40 transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-foreground">{org.name}</td>
                                <td className="py-4 px-6 text-sm text-muted-foreground">{org._count.users}</td>
                                <td className="py-4 px-6 text-sm">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                                        {org.type}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {recentOrgs.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center text-muted-foreground italic">No organizations found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

