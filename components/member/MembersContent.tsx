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
                                <tr className="border-b border-border italic text-muted-foreground text-sm">
                                    <th className="pb-4 font-medium px-4">Name & Email</th>
                                    <th className="pb-4 font-medium px-4">Role</th>
                                    <th className="pb-4 font-medium px-4">Joined Date</th>
                                    <th className="pb-4 font-medium px-4 text-center">Status</th>
                                    <th className="pb-4 font-medium text-right px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {members.map((member: User) => (
                                    <tr key={member.id} className={cn("group hover:bg-muted/50 transition-colors", member.id === currentUserId && "bg-primary/5")}>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-bold text-foreground">
                                                    {member.name} {member.id === currentUserId && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1">You</span>}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                                                member.role === 'ADMIN' ? "bg-purple-500/10 text-purple-600" : "bg-muted text-muted-foreground"
                                            )}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                                            {formatDate(member.createdAt)}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={cn(
                                                'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                                                member.isActive ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
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
                                        <td colSpan={5} className="py-12 text-center text-muted-foreground italic">
                                            No members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-card rounded-xl shadow-sm border border-border p-2 transition-colors duration-300">
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
