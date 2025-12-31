'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addExpense } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { Plus, X, Calendar, Tag, Info, IndianRupee } from 'lucide-react';

export default function AddExpenseModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: 'Food',
        description: '',
        amount: 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        try {
            const result = await addExpense({
                ...formData,
                date: new Date(formData.date),
                amount: Number(formData.amount),
            });

            if (result.success) {
                toast.success('Expense logged successfully!');
                setIsOpen(false);
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    category: 'Food',
                    description: '',
                    amount: 0,
                });
            } else {
                toast.error(result.error || 'Failed to log expense');
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
                Log New Expense
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Log New Expense</h2>
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
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
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
                                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
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
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
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
                            {isPending ? 'Logging...' : 'Log Expense'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
