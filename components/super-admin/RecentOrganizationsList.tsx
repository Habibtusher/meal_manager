import { getRecentOrganizations } from "@/lib/services/super-admin";
import { TrendingUp } from "lucide-react";

export async function RecentOrganizationsList() {
    const recentOrgs = await getRecentOrganizations(5);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Recent Organizations
                </h3>
                <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Org Name</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Users</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Type</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {recentOrgs.map((org: any) => (
                            <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-gray-900">{org.name}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{org._count.users}</td>
                                <td className="py-4 px-6 text-sm">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                                        {org.type}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {recentOrgs.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center text-gray-500 italic">No organizations found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
