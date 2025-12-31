'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateWalletTransaction } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { X, User, IndianRupee, Info, Edit2, Calendar } from 'lucide-react';

interface EditTransactionModalProps {
    transaction: {
        id: string;
        amount: number;
        description: string;
        createdAt: Date;
        user: {
            name: string;
        };
    };
}

export default function EditTransactionModal({ transaction }: EditTransactionModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        amount: Number(transaction.amount),
        description: transaction.description,
        date: new Date(transaction.createdAt).toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        try {
            const result = await updateWalletTransaction(transaction.id, {
                amount: Number(formData.amount),
                description: formData.description,
                date: new Date(formData.date)
            });

            if (result.success) {
                toast.success('Transaction updated successfully!');
                setIsOpen(false);
            } else {
                toast.error(result.error || 'Failed to update transaction');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsPending(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                title="Edit Transaction"
            >
                <Edit2 className="w-4 h-4" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Edit Transaction</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Member</p>
                        <p className="text-sm font-bold text-gray-900">{transaction.user.name}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Date
                        </label>
                        <Input
                            required
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all text-black"
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
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all text-black"
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
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all text-black"
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
                            {isPending ? 'Updating...' : 'Update Transaction'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
