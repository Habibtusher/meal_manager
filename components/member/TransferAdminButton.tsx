'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { transferAdminRole } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface TransferAdminButtonProps {
    targetUserId: string;
    targetUserName: string;
}

export default function TransferAdminButton({ targetUserId, targetUserName }: TransferAdminButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleTransfer = async () => {
        setIsPending(true);
        try {
            const result = await transferAdminRole(targetUserId);
            if (result.success) {
                toast.success(`Admin role transferred to ${targetUserName}`);
                // Since the current user is no longer an admin, their session might need refresh or redirection
                // In many cases, force logout is safest to ensure they don't see admin pages they can't access
                toast('Your role has been updated to Member. Logging out to refresh permissions...', { icon: '🔄' });
                setTimeout(() => {
                    signOut({ callbackUrl: '/login' });
                }, 2000);
            } else {
                toast.error(result.error || 'Failed to transfer role');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsPending(false);
            setIsOpen(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors inline-flex"
                title="Transfer Admin Role"
            >
                <ShieldAlert className="w-4 h-4" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 text-center">
                <div className="px-6 py-8">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Transfer Admin Role?</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        You are about to transfer your <strong>Admin rights</strong> to <strong>{targetUserName}</strong>.
                        Once done, you will become a regular <strong>Member</strong> and will be logged out to refresh your permissions.
                    </p>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 border border-gray-200 hover:bg-gray-50 text-black"
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleTransfer}
                            disabled={isPending}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {isPending ? 'Transferring...' : 'Yes, Transfer'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
