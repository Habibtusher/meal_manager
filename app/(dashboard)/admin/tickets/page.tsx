import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserSupportTickets } from '@/lib/services/super-admin';
import { AdminTicketsClient } from '@/components/tickets/AdminTicketsClient';

export const dynamic = 'force-dynamic';

export default async function AdminTicketsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const rawTickets = await getUserSupportTickets(session.user.id);
    const tickets = JSON.parse(JSON.stringify(rawTickets));

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <AdminTicketsClient initialTickets={tickets} />
        </div>
    );
}
