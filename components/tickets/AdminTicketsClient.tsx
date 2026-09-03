'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    HelpCircle, 
    PlusCircle, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    XCircle, 
    Trash2, 
    X, 
    Calendar,
    Send,
    MessageSquare
} from 'lucide-react';
import { createTicketAction, deleteTicketAction } from '@/lib/actions/tickets';
import { toast } from 'react-hot-toast';

export interface TicketItem {
    id: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    user?: {
        name: string;
        email: string;
    };
}

interface AdminTicketsClientProps {
    initialTickets: TicketItem[];
}

export function AdminTicketsClient({ initialTickets }: AdminTicketsClientProps) {
    const router = useRouter();
    const [tickets, setTickets] = useState<TicketItem[]>(initialTickets);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        subject: '',
        message: '',
    });

    const statusCounts = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Open
                    </span>
                );
            case 'IN_PROGRESS':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        In Progress
                    </span>
                );
            case 'RESOLVED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved
                    </span>
                );
            case 'CLOSED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                        <XCircle className="w-3.5 h-3.5" />
                        Closed
                    </span>
                );
            default:
                return <span className="text-xs text-muted-foreground">{status}</span>;
        }
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await createTicketAction(form);
            if (res.success && res.ticket) {
                toast.success('Support ticket submitted successfully');
                setTickets(prev => [res.ticket as TicketItem, ...prev]);
                setForm({ subject: '', message: '' });
                setIsCreateOpen(false);
                router.refresh();
            } else {
                toast.error(res.error || 'Failed to submit ticket');
            }
        } catch {
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this support ticket?')) return;
        setDeletingId(id);
        try {
            const res = await deleteTicketAction(id);
            if (res.success) {
                toast.success('Ticket deleted');
                setTickets(prev => prev.filter(t => t.id !== id));
                router.refresh();
            } else {
                toast.error(res.error || 'Failed to delete ticket');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2.5">
                        <HelpCircle className="w-8 h-8 text-primary" />
                        Help & Support Tickets
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Submit queries, report issues, or request assistance directly from the Super Admin.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20 hover:opacity-90 transition-all cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    Create Ticket
                </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Tickets</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{statusCounts.total}</p>
                </div>
                <div className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm">
                    <p className="text-xs text-amber-600 dark:text-amber-400 uppercase font-semibold">Open</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{statusCounts.open}</p>
                </div>
                <div className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm">
                    <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold">In Progress</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{statusCounts.inProgress}</p>
                </div>
                <div className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Resolved</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{statusCounts.resolved}</p>
                </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
                {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-sm hover:border-primary/30 transition-all space-y-3"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground text-base">{ticket.subject}</h3>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                            <span>•</span>
                                            <span>Ticket #{ticket.id.slice(-6).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 self-start sm:self-center">
                                    {getStatusBadge(ticket.status)}
                                    <button
                                        onClick={() => handleDelete(ticket.id)}
                                        disabled={deletingId === ticket.id}
                                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
                                        title="Delete ticket"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed pl-1">
                                {ticket.message}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="bg-card text-card-foreground p-12 rounded-2xl border border-border text-center flex flex-col items-center justify-center gap-3">
                        <HelpCircle className="w-12 h-12 text-muted-foreground/40" />
                        <h3 className="text-lg font-bold text-foreground">No Support Tickets Yet</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Need help with your mess calculations, members, or settings? Create a ticket and the Super Admin will review it.
                        </p>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Create Your First Ticket
                        </button>
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card text-card-foreground w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 relative">
                        <button
                            onClick={() => setIsCreateOpen(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <PlusCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Submit Support Ticket</h3>
                                <p className="text-xs text-muted-foreground">Describe your inquiry or issue for the platform admin</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateTicket} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Issue with Meal Rate or Payment settlement"
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                                    Message Details
                                </label>
                                <textarea
                                    rows={5}
                                    required
                                    placeholder="Please provide full details about your problem or question..."
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
