'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function checkSuperAdmin() {
    const session = await auth();
    if (!session?.user || (session.user.role as any) !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized: Super Admin access required');
    }
    return session.user;
}

export async function deleteOrganizationAction(organizationId: string) {
    try {
        await checkSuperAdmin();

        if (!organizationId) {
            return { success: false, error: 'Organization ID is required' };
        }

        await prisma.organization.delete({
            where: { id: organizationId }
        });

        revalidatePath('/super-admin/organizations');
        revalidatePath('/super-admin/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Failed to delete organization:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete organization'
        };
    }
}

export async function updateOrganizationAction(
    organizationId: string,
    data: { name: string; type: string; description?: string }
) {
    try {
        await checkSuperAdmin();

        if (!organizationId) {
            return { success: false, error: 'Organization ID is required' };
        }

        if (!data.name || data.name.trim().length < 2) {
            return { success: false, error: 'Organization name must be at least 2 characters' };
        }

        await prisma.organization.update({
            where: { id: organizationId },
            data: {
                name: data.name.trim(),
                type: data.type.trim().toLowerCase(),
                description: data.description?.trim() || null,
            }
        });

        revalidatePath('/super-admin/organizations');
        revalidatePath('/super-admin/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Failed to update organization:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update organization'
        };
    }
}

export async function createOrganizationAction(data: {
    name: string;
    type: string;
    description?: string;
}) {
    try {
        await checkSuperAdmin();

        if (!data.name || data.name.trim().length < 2) {
            return { success: false, error: 'Organization name must be at least 2 characters' };
        }

        const org = await prisma.organization.create({
            data: {
                name: data.name.trim(),
                type: (data.type || 'mess').trim().toLowerCase(),
                description: data.description?.trim() || null,
            }
        });

        revalidatePath('/super-admin/organizations');
        revalidatePath('/super-admin/dashboard');

        return { success: true, organization: org };
    } catch (error) {
        console.error('Failed to create organization:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create organization'
        };
    }
}

