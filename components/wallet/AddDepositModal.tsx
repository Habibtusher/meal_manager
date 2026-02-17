'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addWalletCredit } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { Plus, X, User, Banknote, Info } from 'lucide-react';

interface Member {
    id: string;
    name: string;
    email: string;
}

interface AddDepositModalProps {
    members: Member[];
}

export default function AddDepositModal({ members }: AddDepositModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        amount: 0,
        description: 'Cash Deposit',
        date: new Date().toLocaleDateString('en-CA')
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.userId) {
            toast.error('Please select a member');
            return;
        }

        setIsPending(true);

        try {
            const [year, month, day] = formData.date.split('-').map(Number);
            const dateObj = new Date();
            dateObj.setFullYear(year, month - 1, day);
            // If it's not today, we might want to reset time to midnight or keep "now" time.
            // Keeping "now" time is usually better for ordering even if it's a past date.

            const result = await addWalletCredit(
                formData.userId,
                Number(formData.amount),
                formData.description,
                dateObj
            );

            if (result.success) {
                toast.success('Deposit added successfully!');
                setIsOpen(false);
                setFormData({
                    userId: '',
                    amount: 0,
                    description: 'Cash Deposit',
                    date: new Date().toLocaleDateString('en-CA')
                });
            } else {
                toast.error(result.error || 'Failed to add deposit');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsPending(false);
        }
    };

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Deposit
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-border">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/50">
                    <h2 className="text-xl font-bold text-foreground">Add Wallet Deposit</h2>
                    <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <User className="w-4 h-4" /> Select Member
                        </label>
                        <select
                            required
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl border border-border bg-muted focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm text-foreground"
                        >
                            <option value="" className="bg-card text-foreground">Choose a member...</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id} className="bg-card text-foreground">
                                    {member.name} ({member.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            Date
                        </label>
                        <Input
                            required
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="bg-muted border-border focus:bg-background transition-all text-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Banknote className="w-4 h-4" /> Amount (৳)
                        </label>
                        <Input
                            required
                            type="number"
                            min="1"
                            placeholder="500"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                            className="bg-muted border-border focus:bg-background transition-all text-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Info className="w-4 h-4" /> Description
                        </label>
                        <Input
                            required
                            placeholder="Cash Payment / Deposit"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="bg-muted border-border focus:bg-background transition-all text-foreground"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 border border-border hover:bg-muted"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1"
                        >
                            {isPending ? 'Processing...' : 'Add Deposit'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
