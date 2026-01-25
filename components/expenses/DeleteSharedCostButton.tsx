'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteSharedCost } from '@/lib/actions/shared-costs';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface DeleteSharedCostButtonProps {
    sharedCostId: string;
    description: string;
}

export default function DeleteSharedCostButton({ sharedCostId, description }: DeleteSharedCostButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteSharedCost(sharedCostId);
        if (result.success) {
            toast.success('Shared cost deleted');
            setShowConfirm(false);
        } else {
            toast.error(result.error || 'Failed to delete');
        }
        setIsDeleting(false);
    };

    if (showConfirm) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Shared Cost?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Are you sure you want to delete "{description}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setShowConfirm(false)}
                            className="flex-1"
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete shared cost"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
