import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllSupportTickets } from '@/lib/services/super-admin';
import { SuperAdminTicketsTable } from '@/components/super-admin/SuperAdminTicketsTable';

export const dynamic = 'force-dynamic';

export default async function TicketsPage() {
  const session = await auth();

  if (!session?.user || (session.user.role as any) !== 'SUPER_ADMIN') {
    redirect('/login');
  }

  const rawTickets = await getAllSupportTickets();
  const tickets = JSON.parse(JSON.stringify(rawTickets));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SuperAdminTicketsTable initialTickets={tickets} />
    </div>
  );
}
