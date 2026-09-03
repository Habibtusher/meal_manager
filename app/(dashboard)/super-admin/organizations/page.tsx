import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllOrganizations } from '@/lib/services/super-admin';
import { OrganizationsTable } from '@/components/super-admin/OrganizationsTable';

export const dynamic = 'force-dynamic';

export default async function OrganizationsPage() {
  const session = await auth();

  if (!session?.user || (session.user.role as any) !== 'SUPER_ADMIN') {
    redirect('/login');
  }

  const rawOrganizations = await getAllOrganizations();
  const organizations = JSON.parse(JSON.stringify(rawOrganizations));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <OrganizationsTable initialOrganizations={organizations} />
    </div>
  );
}
