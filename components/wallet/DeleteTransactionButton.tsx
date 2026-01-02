'use client';

import { useState } from 'react';
import { deleteWalletTransaction } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DeleteTransactionButtonProps {
    transactionId: string;
    description: string;
    userName: string;
}

export default function DeleteTransactionButton({ transactionId, description, userName }: DeleteTransactionButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        setIsPending(true);
        try {
            const result = await deleteWalletTransaction(transactionId);
            if (result.success) {
                toast.success('Transaction deleted and balance reverted');
                setIsOpen(false);
            } else {
                toast.error(result.error || 'Failed to delete transaction');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                title="Delete Transaction"
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
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Transaction?</h3>
                            <p className="text-gray-500 mb-6 text-sm">
                                Are you sure you want to delete this transaction for <span className="font-bold text-gray-700">{userName}</span>?
                                <br />
                                <span className="italic font-medium">&quot;{description}&quot;</span>
                                <br /><br />
                                <span className="text-red-500 font-bold">This will revert the member&apos;s wallet balance!</span>
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
                                    {isPending ? 'Deleting...' : 'Delete & Revert'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
