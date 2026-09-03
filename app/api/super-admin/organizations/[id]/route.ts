import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role as any) !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
        }

        await prisma.organization.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error in DELETE /api/super-admin/organizations/[id]:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
