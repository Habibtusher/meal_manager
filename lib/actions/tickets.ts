'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export async function createTicketAction(formData: { subject: string; message: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'You must be logged in to create a ticket' };
        }

        const subject = formData.subject?.trim();
        const message = formData.message?.trim();

        if (!subject || subject.length < 3) {
            return { success: false, error: 'Subject must be at least 3 characters' };
        }

        if (!message || message.length < 5) {
            return { success: false, error: 'Message must be at least 5 characters' };
        }

        const ticket = await prisma.supportTicket.create({
            data: {
                subject,
                message,
                status: 'OPEN',
                userId: session.user.id,
            },
        });

        revalidatePath('/admin/tickets');
        revalidatePath('/super-admin/tickets');
        revalidatePath('/super-admin/dashboard');

        return { success: true, ticket };
    } catch (error) {
        console.error('Failed to create support ticket:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create support ticket',
        };
    }
}

export async function updateTicketStatusAction(ticketId: string, status: string) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role as any) !== 'SUPER_ADMIN') {
            return { success: false, error: 'Unauthorized: Super Admin access required' };
        }

        if (!VALID_STATUSES.includes(status)) {
            return { success: false, error: 'Invalid status' };
        }

        const ticket = await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { status },
        });

        revalidatePath('/super-admin/tickets');
        revalidatePath('/admin/tickets');

        return { success: true, ticket };
    } catch (error) {
        console.error('Failed to update ticket status:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update ticket status',
        };
    }
}

export async function deleteTicketAction(ticketId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const existingTicket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
        });

        if (!existingTicket) {
            return { success: false, error: 'Ticket not found' };
        }

        const isSuperAdmin = (session.user.role as any) === 'SUPER_ADMIN';
        const isOwner = existingTicket.userId === session.user.id;

        if (!isSuperAdmin && !isOwner) {
            return { success: false, error: 'You do not have permission to delete this ticket' };
        }

        await prisma.supportTicket.delete({
            where: { id: ticketId },
        });

        revalidatePath('/admin/tickets');
        revalidatePath('/super-admin/tickets');

        return { success: true };
    } catch (error) {
        console.error('Failed to delete ticket:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete ticket',
        };
    }
}
