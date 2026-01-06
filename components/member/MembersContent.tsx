import { getOrganizationMembers } from "@/lib/services/members";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import EditMemberModal from "@/components/member/EditMemberModal";
import DeleteMemberButton from "@/components/member/DeleteMemberButton";
import TransferAdminButton from "@/components/member/TransferAdminButton";
import DebouncedSearch from "@/components/ui/DebouncedSearch";
import { Pagination } from "@/components/ui/Pagination";
import { User } from "@prisma/client";

interface MembersContentProps {
    organizationId: string;
    currentPage: number;
    itemsPerPage: number;
    searchQuery?: string;
    currentUserId: string;
}

export async function MembersContent({
    organizationId,
    currentPage,
    itemsPerPage,
    searchQuery,
    currentUserId
}: MembersContentProps) {
    const { totalCount, members } = await getOrganizationMembers(
        organizationId,
        (currentPage - 1) * itemsPerPage,
        itemsPerPage,
        searchQuery
    );

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-0">
                    <DebouncedSearch
                        defaultValue={searchQuery}
                        placeholder="Search members by name or email..."
                        className="flex-1"
                    />
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 italic text-gray-400 text-sm">
                                    <th className="pb-4 font-medium px-4">Name & Email</th>
                                    <th className="pb-4 font-medium px-4">Role</th>
                                    <th className="pb-4 font-medium px-4">Joined Date</th>
                                    <th className="pb-4 font-medium px-4">Wallet Balance</th>
                                    <th className="pb-4 font-medium px-4 text-center">Status</th>
                                    <th className="pb-4 font-medium text-right px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {members.map((member: User) => (
                                    <tr key={member.id} className={cn("group hover:bg-gray-50 transition-colors", member.id === currentUserId && "bg-blue-50/30")}>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {member.name} {member.id === currentUserId && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded ml-1">You</span>}
                                                </p>
                                                <p className="text-sm text-gray-500">{member.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                                                member.role === 'ADMIN' ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                                            )}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                                            {formatDate(member.createdAt)}
                                        </td>
                                        <td className="py-4 px-4 text-sm font-bold whitespace-nowrap">
                                            <span className={Number(member.walletBalance) < 200 ? 'text-red-600' : 'text-green-600'}>
                                                {formatCurrency(member.walletBalance.toString())}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={cn(
                                                'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                                                member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            )}>
                                                {member.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {member.role === 'MEMBER' && member.isActive && (
                                                    <TransferAdminButton targetUserId={member.id} targetUserName={member.name} />
                                                )}
                                                <EditMemberModal member={member} />
                                                <DeleteMemberButton memberId={member.id} memberName={member.name} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {members.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-500 italic">
                                            No members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalCount}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </div>
    );
}
