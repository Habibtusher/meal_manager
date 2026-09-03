'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
    HelpCircle, 
    Search, 
    Trash2, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    XCircle, 
    X, 
    Calendar, 
    User, 
    Mail, 
    Building2,
    SlidersHorizontal,
    MessageSquare,
    Check
} from 'lucide-react';
import { updateTicketStatusAction, deleteTicketAction } from '@/lib/actions/tickets';
import { toast } from 'react-hot-toast';

export interface SuperAdminTicketItem {
    id: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        organization: {
            id: string;
            name: string;
            type: string;
        } | null;
    };
}

interface SuperAdminTicketsTableProps {
    initialTickets: SuperAdminTicketItem[];
}

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export function SuperAdminTicketsTable({ initialTickets }: SuperAdminTicketsTableProps) {
    const router = useRouter();
    const [tickets, setTickets] = useState<SuperAdminTicketItem[]>(initialTickets);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Filter tickets
    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const matchesStatus = selectedStatus === 'ALL' || ticket.status === selectedStatus;
            const q = searchQuery.toLowerCase().trim();
            if (!q) return matchesStatus;

            const matchesQuery =
                ticket.subject.toLowerCase().includes(q) ||
                ticket.message.toLowerCase().includes(q) ||
                ticket.user?.name.toLowerCase().includes(q) ||
                ticket.user?.email.toLowerCase().includes(q) ||
                (ticket.user?.organization?.name && ticket.user.organization.name.toLowerCase().includes(q));

            return matchesStatus && matchesQuery;
        });
    }, [tickets, searchQuery, selectedStatus]);

    // Metrics
    const metrics = useMemo(() => {
        return {
            total: tickets.length,
            open: tickets.filter(t => t.status === 'OPEN').length,
            inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
            resolved: tickets.filter(t => t.status === 'RESOLVED').length,
        };
    }, [tickets]);

    const handleStatusChange = async (ticketId: string, newStatus: string) => {
        setUpdatingId(ticketId);
        try {
            const res = await updateTicketStatusAction(ticketId, newStatus);
            if (res.success) {
                toast.success(`Ticket marked as ${newStatus}`);
                setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
                router.refresh();
            } else {
                toast.error(res.error || 'Failed to update status');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this ticket?')) return;
        setDeletingId(id);
        try {
            const res = await deleteTicketAction(id);
            if (res.success) {
                toast.success('Ticket deleted successfully');
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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2.5">
                    <HelpCircle className="w-8 h-8 text-primary" />
                    Support Tickets Management
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Review, track, and resolve support requests submitted by organization admins and members.
                </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Tickets</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{metrics.total}</p>
                </div>
                <div className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-sm">
                    <p className="text-xs text-amber-600 dark:text-amber-400 uppercase font-semibold">Open</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{metrics.open}</p>
                </div>
                <div className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-sm">
                    <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold">In Progress</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{metrics.inProgress}</p>
                </div>
                <div className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-sm">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Resolved</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{metrics.resolved}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search tickets, subject, admin, or mess..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <SlidersHorizontal className="w-4 h-4 text-muted-foreground mr-1 hidden sm:block" />
                    {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setSelectedStatus(st)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase transition-all cursor-pointer ${
                                selectedStatus === st
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                        >
                            {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tickets Table / Cards */}
            <div className="space-y-4">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => {
                        const createdFormatted = ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                              })
                            : 'N/A';

                        return (
                            <div
                                key={ticket.id}
                                className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm hover:border-border/80 transition-all space-y-4"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <h3 className="font-bold text-foreground text-base">{ticket.subject}</h3>
                                                {getStatusBadge(ticket.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {createdFormatted}
                                                </span>
                                                <span>•</span>
                                                <span className="font-mono text-xs">ID: #{ticket.id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action dropdown or status selector */}
                                    <div className="flex items-center gap-2.5 self-start md:self-center">
                                        <label className="text-xs text-muted-foreground font-medium hidden sm:inline">Status:</label>
                                        <select
                                            value={ticket.status}
                                            disabled={updatingId === ticket.id}
                                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer disabled:opacity-50"
                                        >
                                            {STATUS_OPTIONS.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt.replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleDelete(ticket.id)}
                                            disabled={deletingId === ticket.id}
                                            className="p-2 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer disabled:opacity-50"
                                            title="Delete ticket"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* User & Mess Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/40 p-3.5 rounded-xl text-xs">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground">Requester:</span>
                                        <span className="font-semibold text-foreground">{ticket.user?.name}</span>
                                        <span className="text-muted-foreground">({ticket.user?.email})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground">Organization:</span>
                                        <span className="font-semibold text-foreground">
                                            {ticket.user?.organization?.name || 'No Organization'}
                                        </span>
                                        {ticket.user?.organization?.type && (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-primary/10 text-primary">
                                                {ticket.user.organization.type}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Message body */}
                                <div className="text-sm text-foreground whitespace-pre-line leading-relaxed pl-1 pt-1">
                                    {ticket.message}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-card text-card-foreground p-12 rounded-2xl border border-border text-center flex flex-col items-center justify-center gap-3">
                        <HelpCircle className="w-12 h-12 text-muted-foreground/40" />
                        <h3 className="text-lg font-bold text-foreground">No Tickets Found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            {searchQuery || selectedStatus !== 'ALL'
                                ? 'No tickets matched your filter criteria. Try resetting your search.'
                                : 'There are currently no support tickets submitted by any users.'}
                        </p>
                        {(searchQuery || selectedStatus !== 'ALL') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedStatus('ALL');
                                }}
                                className="text-xs font-medium text-primary hover:underline mt-1"
                            >
                                Reset filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
