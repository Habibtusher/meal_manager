import { auth } from '@/lib/auth';
import AddMemberModal from '@/components/member/AddMemberModal';
import { Suspense } from 'react';
import { MembersSkeleton } from '@/components/member/MembersSkeleton';
import { MembersContent } from '@/components/member/MembersContent';

const ITEMS_PER_PAGE = 10;

export default async function MemberManagement({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; page?: string }>;
}) {
    const session = await auth();
    if (!session?.user?.organizationId) return null;
    const organizationId = session.user.organizationId as string;

    const params = await searchParams;
    const query = params.query;
    const currentPage = Math.max(1, parseInt(params.page || '1') || 1);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
                    <p className="text-gray-500 mt-1">Manage and track members of your mess.</p>
                </div>
                <AddMemberModal />
            </div>

            <Suspense key={`${query}-${currentPage}`} fallback={<MembersSkeleton />}>
                <MembersContent
                    organizationId={organizationId}
                    currentPage={currentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    searchQuery={query}
                    currentUserId={session.user.id as string}
                />
            </Suspense>
        </div>
    );
}
