'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addExpense, getActiveMembers } from '@/lib/actions';
import { addSharedCost } from '@/lib/actions/shared-costs';
import { toast } from 'react-hot-toast';
import { Plus, X, Calendar, Tag, Info, Banknote, Users, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AddExpenseModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    // Mode: 'MEAL' (Expense) or 'SHARED' (SharedCost)
    const [mode, setMode] = useState<'MEAL' | 'SHARED'>('MEAL');

    // Shared Cost Distribution: 'EQUAL' or 'CUSTOM'
    const [distribution, setDistribution] = useState<'EQUAL' | 'CUSTOM'>('EQUAL');

    const [members, setMembers] = useState<{ id: string; name: string }[]>([]);

    const [formData, setFormData] = useState({
        date: new Date().toLocaleDateString('en-CA'),
        category: 'Food',
        description: '',
        amount: 0,
    });

    // For Shared Costs
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [customAllocations, setCustomAllocations] = useState<Record<string, number>>({});

    useEffect(() => {
        if (isOpen && mode === 'SHARED') {
            getActiveMembers().then(setMembers);
        }
    }, [isOpen, mode]);

    // Initialize allocations when members load or mode changes
    useEffect(() => {
        if (members.length > 0) {
            // Default: Select all
            setSelectedMembers(members.map(m => m.id));

            // Default Custom allocations
            const initials: Record<string, number> = {};
            members.forEach(m => {
                initials[m.id] = 0;
            });
            setCustomAllocations(initials);
        }
    }, [members, formData.category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        try {
            let result;

            if (mode === 'MEAL') {
                result = await addExpense({
                    ...formData,
                    date: new Date(formData.date),
                    amount: Number(formData.amount),
                });
            } else {
                // Shared Cost Logic
                let allocations: { userId: string; amount: number }[] = [];
                let totalAmount = 0;

                if (distribution === 'EQUAL') {
                    const count = selectedMembers.length;
                    if (count === 0) throw new Error("Select at least one member");
                    const perPerson = Number(formData.amount) / count;
                    allocations = selectedMembers.map(id => ({ userId: id, amount: perPerson }));
                    totalAmount = Number(formData.amount);
                } else {
                    // Custom
                    allocations = members.filter(m => selectedMembers.includes(m.id)).map(m => {
                        const amt = Number(customAllocations[m.id] || 0);
                        return { userId: m.id, amount: amt };
                    });
                    totalAmount = allocations.reduce((sum, a) => sum + a.amount, 0);
                }

                result = await addSharedCost({
                    description: formData.description,
                    date: new Date(formData.date),
                    category: formData.category,
                    amount: totalAmount,
                    allocations
                });
            }

            if (result.success) {
                toast.success(mode === 'MEAL' ? 'Expense logged!' : 'Shared cost added!');
                setIsOpen(false);
                setFormData({
                    date: new Date().toLocaleDateString('en-CA'),
                    category: 'Food',
                    description: '',
                    amount: 0,
                });
                setMode('MEAL');
            } else {
                toast.error(result.error || 'Failed to log');
            }
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Something went wrong');
        } finally {
            setIsPending(false);
        }
    };

    const toggleMember = (id: string) => {
        setSelectedMembers(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Log Cost
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 my-8 border border-border">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                    <h2 className="text-xl font-bold text-foreground">Log New Cost</h2>
                    <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
                    <div className="p-6 space-y-4 overflow-y-auto min-h-0 flex-1">
                        {/* Mode Selection */}
                        <div className="flex p-1 bg-muted rounded-lg">
                            <button
                                type="button"
                                onClick={() => setMode('MEAL')}
                                className={cn(
                                    "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                                    mode === 'MEAL' ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Meal Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMode('SHARED'); setFormData({ ...formData, category: 'Utility' }); }}
                                className={cn(
                                    "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                                    mode === 'SHARED' ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Shared / Room Cost
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground block">Date</label>
                                <Input
                                    required
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground block">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {mode === 'MEAL' ? (
                                        <>
                                            <option value="Food">Food & Grocery</option>
                                            <option value="Staff">Staff Salary</option>
                                            <option value="Other">Other</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Utility">Utilities (Gas/WiFi)</option>
                                            <option value="Rent">Room Rent</option>
                                            <option value="Other">Other Shared</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground block">Description</label>
                            <Input
                                required
                                placeholder={mode === 'MEAL' ? "e.g. Chicken, Rice" : "e.g. WiFi Bill, Monthly Rent"}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {mode === 'SHARED' && (
                            <div className="space-y-4 pt-2 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-foreground">Distribution</label>
                                    <div className="flex bg-muted rounded-lg p-0.5">
                                        <button
                                            type="button"
                                            onClick={() => setDistribution('EQUAL')}
                                            className={cn(
                                                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                                distribution === 'EQUAL' ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Equal Split
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDistribution('CUSTOM')}
                                            className={cn(
                                                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                                distribution === 'CUSTOM' ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Custom / Room
                                        </button>
                                    </div>
                                </div>

                                {distribution === 'EQUAL' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Total Amount (৳)</label>
                                        <Input
                                            required
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Will be split among {selectedMembers.length} members ({selectedMembers.length > 0 ? (Number(formData.amount) / selectedMembers.length).toFixed(2) : 0} each).
                                        </p>
                                    </div>
                                )}

                                {distribution === 'CUSTOM' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Total Amount (Calculated ৳)</label>
                                        <div className="h-11 flex items-center px-4 rounded-xl border border-border bg-muted text-base font-bold text-primary">
                                            ৳ {Object.entries(customAllocations)
                                                .filter(([id]) => selectedMembers.includes(id))
                                                .reduce((sum, [, val]) => sum + (Number(val) || 0), 0)}
                                        </div>
                                        <p className="text-xs text-muted-foreground italic">
                                            Automatically calculated based on individual entries below.
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-xl p-2 bg-muted/30">
                                    <div className="flex items-center justify-between pb-2 border-b border-border mb-2 sticky top-0 bg-muted/95 backdrop-blur-sm px-1">
                                        <span className="text-xs font-bold text-muted-foreground uppercase">Select Members</span>
                                        <button type="button" onClick={() => setSelectedMembers(members.map(m => m.id))} className="text-xs text-primary hover:underline font-medium">Select All</button>
                                    </div>
                                    <div className="px-1">
                                        {members.map(member => (
                                            <div key={member.id} className="flex items-center justify-between py-1.5 last:border-0 border-b border-border/50">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(member.id)}
                                                        onChange={() => toggleMember(member.id)}
                                                        className="rounded border-border bg-card text-primary focus:ring-primary/20"
                                                    />
                                                    <span className="text-sm text-foreground font-medium">{member.name}</span>
                                                </div>
                                                {distribution === 'CUSTOM' && selectedMembers.includes(member.id) && (
                                                    <input
                                                        type="number"
                                                        className="w-24 px-2 py-1 text-right text-sm border border-border rounded bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        placeholder="0"
                                                        value={customAllocations[member.id] || ''}
                                                        onChange={(e) => setCustomAllocations({ ...customAllocations, [member.id]: Number(e.target.value) })}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {mode === 'MEAL' && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground block">Amount (৳)</label>
                                <Input
                                    required
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                />
                            </div>
                        )}

                    </div>

                    <div className="p-6 flex gap-3 border-t border-border bg-muted/30">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="flex-1 border border-border">Cancel</Button>
                        <Button type="submit" disabled={isPending} className="flex-1">
                            {isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
