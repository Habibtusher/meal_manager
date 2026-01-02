'use client';

import { useState } from 'react';
import { deleteExpense } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DeleteExpenseButtonProps {
    expenseId: string;
    description: string;
}

export default function DeleteExpenseButton({ expenseId, description }: DeleteExpenseButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        setIsPending(true);
        try {
            const result = await deleteExpense(expenseId);
            if (result.success) {
                toast.success('Expense deleted successfully');
                setIsOpen(false);
            } else {
                toast.error(result.error || 'Failed to delete expense');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Expense"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Expense?</h3>
                            <p className="text-gray-500 mb-6">
                                Are you sure you want to delete <span className="font-bold text-gray-700">&quot;{description}&quot;</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 border border-gray-200"
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    disabled={isPending}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100"
                                >
                                    {isPending ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
