'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addWalletCredit } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { Plus, X, User, IndianRupee, Info } from 'lucide-react';

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
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.userId) {
            toast.error('Please select a member');
            return;
        }

        setIsPending(true);

        try {
            const result = await addWalletCredit(
                formData.userId,
                Number(formData.amount),
                formData.description,
                new Date(formData.date)
            );

            if (result.success) {
                toast.success('Deposit added successfully!');
                setIsOpen(false);
                setFormData({
                    userId: '',
                    amount: 0,
                    description: 'Cash Deposit',
                    date: new Date().toISOString().split('T')[0]
                });
            } else {
                toast.error(result.error || 'Failed to add deposit');
            }
        } catch (error) {
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Add Wallet Deposit</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <User className="w-4 h-4" /> Select Member
                        </label>
                        <select
                            required
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                        >
                            <option value="">Choose a member...</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} ({member.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            Date
                        </label>
                        <Input
                            required
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" /> Amount (৳)
                        </label>
                        <Input
                            required
                            type="number"
                            min="1"
                            placeholder="500"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Info className="w-4 h-4" /> Description
                        </label>
                        <Input
                            required
                            placeholder="Cash Payment / Deposit"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 border border-gray-200 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                        >
                            {isPending ? 'Processing...' : 'Add Deposit'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
