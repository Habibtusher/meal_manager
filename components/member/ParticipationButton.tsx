'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { markParticipation } from '@/lib/actions';
import { MealStatus } from '@prisma/client';
import { toast } from 'react-hot-toast'; // I should install this or use alert

interface ParticipationButtonProps {
    mealScheduleId: string;
    currentStatus?: MealStatus;
}

export function ParticipationButton({ mealScheduleId, currentStatus }: ParticipationButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleMark = async (status: MealStatus) => {
        setLoading(true);
        try {
            const res = await markParticipation(mealScheduleId, status);
            if (res.success) {
                toast.success(status === 'CONFIRMED' ? 'Joined successfully!' : 'Participation cancelled');
            } else {
                toast.error(res.error || 'Failed to update');
            }
        } catch (e) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (currentStatus === 'CONFIRMED') {
        return (
            <Button
                size="sm"
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => handleMark('CANCELLED')}
                isLoading={loading}
            >
                Cancel Participation
            </Button>
        );
    }

    return (
        <Button
            size="sm"
            variant="primary"
            onClick={() => handleMark('CONFIRMED')}
            isLoading={loading}
        >
            Confirm Joining
        </Button>
    );
}
