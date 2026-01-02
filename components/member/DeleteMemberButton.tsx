'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { deleteMember } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

interface DeleteMemberButtonProps {
    memberId: string;
    memberName: string;
}

export default function DeleteMemberButton({ memberId, memberName }: DeleteMemberButtonProps) {
    const [isPending, setIsPending] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsPending(true);
        try {
            const result = await deleteMember(memberId);
            if (result.success) {
                toast.success('Member deleted successfully');
            } else {
                toast.error(result.error || 'Failed to delete member');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsPending(false);
            setShowConfirm(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 p-6 space-y-4">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                            <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Delete Member</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            Are you sure you want to delete <b>{memberName}</b>? This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 border border-gray-200 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirm(true)}
            className="p-2 h-auto text-red-500 hover:bg-red-50 hover:text-red-700"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
}
