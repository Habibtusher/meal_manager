'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { changePassword } from '@/lib/actions';
import { toast } from 'react-hot-toast';

export default function PasswordForm() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('All fields are required');
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        const result = await changePassword(currentPassword, newPassword);

        if (result.success) {
            toast.success('Password updated successfully');
            // Optional: reset form
            (document.getElementById('password-form') as HTMLFormElement)?.reset();
        } else {
            toast.error(result.error || 'Failed to update password');
        }
        setIsLoading(false);
    };

    return (
        <form id="password-form" action={handleSubmit} className="space-y-4">
            <Input
                name="currentPassword"
                label="Current Password"
                type="password"
                required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    name="newPassword"
                    label="New Password"
                    type="password"
                    required
                />
                <Input
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    required
                />
            </div>
            <div className="pt-4">
                <Button type="submit" variant="outline" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
            </div>
        </form>
    );
}
