import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import AddMemberModal from '@/components/member/AddMemberModal';
import EditMemberModal from '@/components/member/EditMemberModal';
import DeleteMemberButton from '@/components/member/DeleteMemberButton';
import { User } from '@prisma/client';

export default async function MemberManagement({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const session = await auth();
    const organizationId = session?.user.organizationId!;
    const { query } = await searchParams;

    const members = await prisma.user.findMany({
        where: {
            organizationId,
            role: 'MEMBER',
            ...(query ? {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ]
            } : {})
        },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
                    <p className="text-gray-500 mt-1">Manage and track members of your mess.</p>
                </div>
                <AddMemberModal />
            </div>

            <Card>
                <CardHeader className="pb-0">
                    <form className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                name="query"
                                defaultValue={query}
                                placeholder="Search members by name or email..."
                                className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                            />
                        </div>
                        <Button type="submit" variant="ghost" className="h-11 px-6 border border-gray-200 hover:bg-gray-50 rounded-xl">
                            Search
                        </Button>
                    </form>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 italic text-gray-400 text-sm">
                                    <th className="pb-4 font-medium px-4">Name & Email</th>
                                    <th className="pb-4 font-medium px-4">Joined Date</th>
                                    <th className="pb-4 font-medium px-4">Wallet Balance</th>
                                    <th className="pb-4 font-medium px-4">Status</th>
                                    <th className="pb-4 font-medium text-right px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {members.map((member: User) => (
                                    <tr key={member.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-bold text-gray-900">{member.name}</p>
                                                <p className="text-sm text-gray-500">{member.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">
                                            {formatDate(member.createdAt)}
                                        </td>
                                        <td className="py-4 px-4 text-sm font-bold">
                                            <span className={Number(member.walletBalance) < 200 ? 'text-red-600' : 'text-green-600'}>
                                                {formatCurrency(member.walletBalance.toString())}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={cn(
                                                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                                                member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            )}>
                                                {member.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <EditMemberModal member={member} />
                                                <DeleteMemberButton memberId={member.id} memberName={member.name} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {members.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-500 italic">
                                            No members found. Add your first member to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
