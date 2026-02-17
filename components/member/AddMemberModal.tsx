'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createMember } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export default function AddMemberModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        try {
            const result = await createMember({
                name: formData.name,
                email: formData.email,
            });
            if (result.success) {
                toast.success('Member added successfully! Default password: Member@123');
                setFormData({ name: '', email: '' });
                setIsOpen(false);
            } else {
                toast.error(result.error || 'Failed to add member');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsPending(false);
        }
    };

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add New Member
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-border">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/50">
                    <h2 className="text-xl font-bold text-foreground">Add New Member</h2>
                    <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                        <UserPlus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                        <Input
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-muted border-border focus:bg-background transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                        <Input
                            required
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-muted border-border focus:bg-background transition-all"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 border border-border hover:bg-muted"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1"
                        >
                            {isPending ? 'Adding...' : 'Add Member'}
                        </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                        Members will be created with default password <b>Member@123</b>
                    </p>
                </form>
            </div>
        </div>
    );
}
