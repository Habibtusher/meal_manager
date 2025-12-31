'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateExpense } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { X, Calendar, Tag, Info, IndianRupee, Edit2 } from 'lucide-react';

interface EditExpenseModalProps {
    expense: {
        id: string;
        date: Date;
        category: string;
        description: string;
        amount: number;
    };
}

export default function EditExpenseModal({ expense }: EditExpenseModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date(expense.date).toISOString().split('T')[0],
        category: expense.category,
        description: expense.description,
        amount: Number(expense.amount),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        try {
            const result = await updateExpense(expense.id, {
                ...formData,
                date: new Date(formData.date),
                amount: Number(formData.amount),
            });

            if (result.success) {
                toast.success('Expense updated successfully!');
                setIsOpen(false);
            } else {
                toast.error(result.error || 'Failed to update expense');
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
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Expense"
            >
                <Edit2 className="w-4 h-4" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Edit Expense</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm text-black"
                            >
                                <option value="Food">Food & Grocery</option>
                                <option value="Utility">Utilities (Gas/Water)</option>
                                <option value="Rent">Rent</option>
                                <option value="Staff">Staff Salary</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <IndianRupee className="w-4 h-4" /> Amount (৳)
                            </label>
                            <Input
                                required
                                type="number"
                                min="0"
                                placeholder="0"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-all text-black"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Info className="w-4 h-4" /> Description
                        </label>
                        <Input
                            required
                            placeholder="Buy rice and chicken"
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
                            {isPending ? 'Updating...' : 'Update Expense'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
