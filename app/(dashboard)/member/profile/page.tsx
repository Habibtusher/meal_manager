import { auth } from '@/lib/auth';
import { Suspense } from 'react';
import { ProfileSkeleton } from '@/components/member/ProfileSkeleton';
import { ProfileContent } from '@/components/member/ProfileContent';

export default async function MemberProfile() {
    const session = await auth();
    if (!session?.user?.id) return null;
    const userId = session.user.id;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-500 mt-1">Manage your personal information and account preferences.</p>
            </div>

            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent userId={userId} />
            </Suspense>
        </div>
    );
}
