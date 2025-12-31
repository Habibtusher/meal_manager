'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateMember } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { Edit2 } from 'lucide-react';

interface EditMemberModalProps {
    member: {
        id: string;
        name: string;
        email: string;
        isActive: boolean;
    };
}

export default function EditMemberModal({ member }: EditMemberModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        name: member.name,
        email: member.email,
        isActive: member.isActive,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        try {
            const result = await updateMember(member.id, formData);
            if (result.success) {
                toast.success('Member updated successfully');
                setIsOpen(false);
            } else {
                toast.error(result.error || 'Failed to update member');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsPending(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="p-2 h-auto hover:bg-white hover:border border-gray-200"
            >
                <Edit2 className="w-4 h-4 text-gray-500" />
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Edit Member</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit2 className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                        <Input
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <Input
                            required
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Active Member
                        </label>
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
                            {isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
