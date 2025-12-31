'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateProfile } from '@/lib/actions';
import { toast } from 'react-hot-toast';

interface ProfileFormProps {
    user: {
        name: string;
        email: string;
    };
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const name = formData.get('name') as string;

        if (!name) {
            toast.error('Name is required');
            setIsLoading(false);
            return;
        }

        const result = await updateProfile({ name });

        if (result.success) {
            toast.success('Profile updated successfully');
        } else {
            toast.error(result.error || 'Failed to update profile');
        }
        setIsLoading(false);
    };

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    name="name"
                    label="Full Name"
                    defaultValue={user.name}
                    required
                />
                <Input
                    label="Email Address"
                    defaultValue={user.email}
                    disabled
                    className="bg-gray-50 text-gray-500"
                />
            </div>
            <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
