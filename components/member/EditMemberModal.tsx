'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateMember } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { Edit2, X, UserCog, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        } catch {
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
                onClick={() => {
                    setFormData({
                        name: member.name,
                        email: member.email,
                        isActive: member.isActive,
                    });
                    setIsOpen(true);
                }}
                className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                title="Edit Member"
            >
                <Edit2 className="w-4 h-4" />
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
            <div 
                className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border text-left"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/40 text-left">
                    <div className="flex items-center gap-3 text-left">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                            <UserCog className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-bold text-foreground">Edit Member</h2>
                            <p className="text-xs text-muted-foreground">Update member profile details and status.</p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setIsOpen(false)} 
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
                    <div className="space-y-1.5 text-left">
                        <label htmlFor="edit-name" className="block text-xs font-semibold text-foreground uppercase tracking-wider text-left">
                            Full Name
                        </label>
                        <Input
                            id="edit-name"
                            required
                            placeholder="e.g. John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-background border-border text-foreground focus:bg-background transition-all text-left"
                        />
                    </div>

                    <div className="space-y-1.5 text-left">
                        <label htmlFor="edit-email" className="block text-xs font-semibold text-foreground uppercase tracking-wider text-left">
                            Email Address
                        </label>
                        <Input
                            id="edit-email"
                            required
                            type="email"
                            placeholder="e.g. john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-background border-border text-foreground focus:bg-background transition-all text-left"
                        />
                    </div>

                    {/* Active Status Card */}
                    <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between text-left">
                        <div className="space-y-0.5 text-left">
                            <div className="flex items-center gap-2 text-left">
                                <span className="text-sm font-semibold text-foreground">Membership Status</span>
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                    formData.isActive ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-destructive/10 text-destructive"
                                )}>
                                    {formData.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground text-left">
                                {formData.isActive 
                                    ? 'Member can be assigned meals and receive mess alerts.' 
                                    : 'Inactive members cannot participate in new meal schedules.'}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-3 flex-shrink-0">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border"></div>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center gap-3 text-left">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsOpen(false)}
                            disabled={isPending}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isPending}
                            disabled={isPending}
                            className="flex-1 bg-primary text-primary-foreground font-semibold"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
