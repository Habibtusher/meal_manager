'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Building2, 
    Users, 
    Utensils, 
    Receipt, 
    Search, 
    Trash2, 
    Edit, 
    AlertTriangle, 
    X, 
    Check, 
    Calendar, 
    Mail, 
    User,
    PlusCircle,
    SlidersHorizontal,
    Sparkles
} from 'lucide-react';
import { deleteOrganizationAction, updateOrganizationAction, createOrganizationAction } from '@/lib/actions/super-admin';
import { toast } from 'react-hot-toast';

export interface OrganizationItem {
    id: string;
    name: string;
    description: string | null;
    type: string;
    createdAt: Date | string;
    _count: {
        users: number;
        mealSchedules: number;
        expenses: number;
        walletTransactions: number;
    };
    users: Array<{
        id: string;
        name: string;
        email: string;
    }>;
}

interface OrganizationsTableProps {
    initialOrganizations: OrganizationItem[];
}

export function OrganizationsTable({ initialOrganizations }: OrganizationsTableProps) {
    const router = useRouter();
    const [organizations, setOrganizations] = useState<OrganizationItem[]>(initialOrganizations);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('ALL');

    // Modals
    const [editingOrg, setEditingOrg] = useState<OrganizationItem | null>(null);
    const [deletingOrg, setDeletingOrg] = useState<OrganizationItem | null>(null);
    const [isCreatingOrg, setIsCreatingOrg] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit form state
    const [editForm, setEditForm] = useState({ name: '', type: 'mess', description: '' });
    // Create form state
    const [createForm, setCreateForm] = useState({ name: '', type: 'mess', description: '' });

    // Filtered data
    const filteredOrgs = useMemo(() => {
        return organizations.filter(org => {
            const matchesType = selectedType === 'ALL' || org.type.toLowerCase() === selectedType.toLowerCase();
            const admin = org.users?.[0];
            const q = searchQuery.toLowerCase().trim();
            if (!q) return matchesType;

            const matchesQuery = 
                org.name.toLowerCase().includes(q) ||
                (org.description && org.description.toLowerCase().includes(q)) ||
                org.type.toLowerCase().includes(q) ||
                (admin && (admin.name.toLowerCase().includes(q) || admin.email.toLowerCase().includes(q)));

            return matchesType && matchesQuery;
        });
    }, [organizations, searchQuery, selectedType]);

    // Stats calculations
    const stats = useMemo(() => {
        const totalOrgs = organizations.length;
        const totalUsers = organizations.reduce((acc, curr) => acc + (curr._count.users || 0), 0);
        const totalMeals = organizations.reduce((acc, curr) => acc + (curr._count.mealSchedules || 0), 0);
        const totalExpenses = organizations.reduce((acc, curr) => acc + (curr._count.expenses || 0), 0);
        return { totalOrgs, totalUsers, totalMeals, totalExpenses };
    }, [organizations]);

    // Handlers
    const handleOpenEdit = (org: OrganizationItem) => {
        setEditingOrg(org);
        setEditForm({
            name: org.name,
            type: org.type,
            description: org.description || '',
        });
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOrg) return;

        setIsSubmitting(true);
        try {
            const res = await updateOrganizationAction(editingOrg.id, editForm);
            if (res.success) {
                toast.success('Organization updated successfully');
                setOrganizations(prev => prev.map(item => item.id === editingOrg.id ? {
                    ...item,
                    name: editForm.name,
                    type: editForm.type,
                    description: editForm.description || null
                } : item));
                setEditingOrg(null);
                router.refresh();
            } else {
                toast.error(res.error || 'Failed to update organization');
            }
        } catch {
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingOrg) return;

        setIsSubmitting(true);
        try {
            const res = await deleteOrganizationAction(deletingOrg.id);
            if (res.success) {
                toast.success(`Deleted ${deletingOrg.name} successfully`);
                setOrganizations(prev => prev.filter(item => item.id !== deletingOrg.id));
                setDeletingOrg(null);
                router.refresh();
            } else {
                toast.error(res.error || 'Failed to delete organization');
            }
        } catch {
            toast.error('An unexpected error occurred during deletion');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await createOrganizationAction(createForm);
            if (res.success && res.organization) {
                toast.success('Organization created successfully');
                const newOrg: OrganizationItem = {
                    ...res.organization,
                    _count: { users: 0, mealSchedules: 0, expenses: 0, walletTransactions: 0 },
                    users: []
                };
                setOrganizations(prev => [newOrg, ...prev]);
                setIsCreatingOrg(false);
                setCreateForm({ name: '', type: 'mess', description: '' });
                router.refresh();
            } else {
                toast.error(res.error || 'Failed to create organization');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2.5">
                        <Building2 className="w-8 h-8 text-primary" />
                        Mess & Organization Management
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        View, manage, update, and remove all registered messes across the platform.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreatingOrg(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20 hover:opacity-90 transition-all cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    Add Organization
                </button>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Total Messes</p>
                        <p className="text-2xl font-bold text-foreground mt-0.5">{stats.totalOrgs}</p>
                    </div>
                </div>

                <div className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Total Members</p>
                        <p className="text-2xl font-bold text-foreground mt-0.5">{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                        <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Meal Schedules</p>
                        <p className="text-2xl font-bold text-foreground mt-0.5">{stats.totalMeals}</p>
                    </div>
                </div>

                <div className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                        <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Expenses Logged</p>
                        <p className="text-2xl font-bold text-foreground mt-0.5">{stats.totalExpenses}</p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by mess name, admin or email..."
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
                    {['ALL', 'mess', 'hostel', 'restaurant'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                                selectedType.toLowerCase() === type.toLowerCase()
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                        >
                            {type === 'ALL' ? 'All Types' : type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <th className="py-4 px-6">Mess / Organization</th>
                                <th className="py-4 px-6">Admin Contact</th>
                                <th className="py-4 px-6">Type</th>
                                <th className="py-4 px-6 text-center">Members</th>
                                <th className="py-4 px-6 text-center">Meals / Logs</th>
                                <th className="py-4 px-6">Created Date</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-sm">
                            {filteredOrgs.length > 0 ? (
                                filteredOrgs.map((org) => {
                                    const admin = org.users?.[0];
                                    const createdFormatted = org.createdAt
                                        ? new Date(org.createdAt).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric',
                                          })
                                        : 'N/A';

                                    return (
                                        <tr key={org.id} className="hover:bg-muted/30 transition-colors">
                                            {/* Org details */}
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-foreground">{org.name}</div>
                                                {org.description && (
                                                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-xs">
                                                        {org.description}
                                                    </div>
                                                )}
                                                <div className="text-[11px] text-muted-foreground/80 font-mono mt-0.5">
                                                    ID: {org.id.slice(0, 10)}...
                                                </div>
                                            </td>

                                            {/* Admin */}
                                            <td className="py-4 px-6">
                                                {admin ? (
                                                    <div>
                                                        <div className="flex items-center gap-1.5 font-medium text-foreground text-xs">
                                                            <User className="w-3.5 h-3.5 text-primary" />
                                                            {admin.name}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                            <Mail className="w-3 h-3" />
                                                            {admin.email}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">No admin assigned</span>
                                                )}
                                            </td>

                                            {/* Type */}
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                                    {org.type}
                                                </span>
                                            </td>

                                            {/* Users Count */}
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-semibold">
                                                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {org._count.users}
                                                </span>
                                            </td>

                                            {/* Meals & Expenses */}
                                            <td className="py-4 px-6 text-center">
                                                <div className="text-xs text-muted-foreground space-y-0.5">
                                                    <div>{org._count.mealSchedules} meals</div>
                                                    <div>{org._count.expenses} expenses</div>
                                                </div>
                                            </td>

                                            {/* Created */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {createdFormatted}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenEdit(org)}
                                                        className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                                                        title="Manage / Edit Mess"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingOrg(org)}
                                                        className="p-2 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                                                        title="Delete Mess"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Building2 className="w-10 h-10 text-muted-foreground/50" />
                                            <p className="text-base font-semibold text-foreground">No organizations found</p>
                                            <p className="text-xs text-muted-foreground max-w-sm">
                                                {searchQuery
                                                    ? `No organization matched "${searchQuery}". Try clearing your search filters.`
                                                    : 'No messes have been registered in the database yet.'}
                                            </p>
                                            {searchQuery && (
                                                <button
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setSelectedType('ALL');
                                                    }}
                                                    className="mt-2 text-xs font-medium text-primary hover:underline"
                                                >
                                                    Clear filters
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Organization Modal */}
            {editingOrg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card text-card-foreground w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 relative">
                        <button
                            onClick={() => setEditingOrg(null)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Edit className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Manage Organization</h3>
                                <p className="text-xs text-muted-foreground">Update details for {editingOrg.name}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                                    Organization / Mess Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                                    Type
                                </label>
                                <select
                                    value={editForm.type}
                                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                                >
                                    <option value="mess">Mess</option>
                                    <option value="hostel">Hostel</option>
                                    <option value="restaurant">Restaurant</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                                    Description (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    placeholder="Brief description of the mess..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingOrg(null)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Organization Modal */}
            {isCreatingOrg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card text-card-foreground w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 relative">
                        <button
                            onClick={() => setIsCreatingOrg(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <PlusCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Add New Organization</h3>
                                <p className="text-xs text-muted-foreground">Register a new mess or hostel on the platform</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateOrg} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                                    Organization / Mess Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Dhaka Central Mess"
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                                    Type
                                </label>
                                <select
                                    value={createForm.type}
                                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                                >
                                    <option value="mess">Mess</option>
                                    <option value="hostel">Hostel</option>
                                    <option value="restaurant">Restaurant</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                                    Description (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    placeholder="Brief description or address..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingOrg(false)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Organization'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingOrg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl border border-destructive/30 shadow-2xl p-6 relative">
                        <button
                            onClick={() => setDeletingOrg(null)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3.5 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Delete Mess?</h3>
                                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-sm text-foreground mb-4 leading-relaxed">
                            Are you sure you want to delete <strong className="font-semibold text-destructive">{deletingOrg.name}</strong>?
                        </p>

                        <div className="p-3.5 rounded-xl bg-destructive/5 border border-destructive/20 text-xs text-muted-foreground mb-5 space-y-1.5">
                            <p className="font-semibold text-destructive flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Permanent Cascade Deletion:
                            </p>
                            <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                                <li>All {deletingOrg._count.users} user accounts in this mess</li>
                                <li>All {deletingOrg._count.mealSchedules} meal schedules and records</li>
                                <li>All {deletingOrg._count.expenses} expense records and transactions</li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingOrg(null)}
                                className="px-4 py-2 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                                Keep Organization
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleConfirmDelete}
                                className="px-5 py-2 rounded-xl text-sm font-medium bg-destructive text-destructive-foreground hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
