import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllOrganizations } from '@/lib/services/super-admin';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role as any) !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const orgs = await getAllOrganizations();
        return NextResponse.json(orgs);
    } catch (error) {
        console.error('API Error in GET /api/super-admin/organizations:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
