'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { batchMarkAttendance } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { Save, Plus, Minus, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

interface Member {
    id: string;
    name: string;
    email: string;
}

interface UserMealCount {
    userId: string;
    mealType: MealType;
    count: number;
}

interface AttendanceBoardProps {
    members: Member[];
    initialCounts: UserMealCount[];
    date: Date;
}

export default function AttendanceBoard({ members, initialCounts, date }: AttendanceBoardProps) {
    const [isSaving, setIsSaving] = useState(false);

    // Track counts as a Record<`${userId}_${mealType}`, count>
    const [counts, setCounts] = useState<Record<string, number>>({});

    // Sync state with props when date/initialCounts change
    useEffect(() => {
        const initialState: Record<string, number> = {};
        members.forEach(member => {
            ['BREAKFAST', 'LUNCH', 'DINNER'].forEach(type => {
                const key = `${member.id}_${type}`;
                const existing = initialCounts.find(c => c.userId === member.id && c.mealType === type);
                initialState[key] = existing ? existing.count : 0;
            });
        });
        setCounts(initialState);
    }, [initialCounts, members, date]);

    const updateCount = (userId: string, mealType: MealType, delta: number) => {
        const key = `${userId}_${mealType}`;
        setCounts(prev => {
            const current = prev[key] || 0;
            const newVal = Math.max(0, current + delta);
            return { ...prev, [key]: newVal };
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const records = Object.entries(counts).map(([key, count]) => {
                const [userId, mealType] = key.split('_');
                return { userId, mealType: mealType as MealType, count };
            });

            const result = await batchMarkAttendance(date, records);
            if (result.success) {
                toast.success('Attendance saved successfully');
            } else {
                toast.error(result.error || 'Failed to save attendance');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md py-4 z-10 border-b border-gray-100 gap-4">
                <div className="flex items-center gap-2 md:gap-6 overflow-x-auto">
                    {['BREAKFAST', 'LUNCH', 'DINNER'].map((type) => {
                        const total = Object.entries(counts).reduce((acc, [key, count]) => {
                            return key.endsWith(type) ? acc + count : acc;
                        }, 0);

                        return (
                            <div key={type} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{type}</span>
                                <span className="text-lg font-black text-gray-900">{total}</span>
                            </div>
                        );
                    })}
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gray-900 hover:bg-gray-800 text-white min-w-[140px] shadow-lg shadow-gray-200"
                >
                    {isSaving ? 'Saving...' : (
                        <span className="flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save Board
                        </span>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {members.map((member) => {
                    const b = counts[`${member.id}_BREAKFAST`] || 0;
                    const l = counts[`${member.id}_LUNCH`] || 0;
                    const d = counts[`${member.id}_DINNER`] || 0;
                    const total = b + l + d;

                    return (
                        <div key={member.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.email}</p>
                                    </div>
                                </div>
                                <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${total > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                    {total.toFixed(1)} Meals
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {['BREAKFAST', 'LUNCH', 'DINNER'].map((type) => {
                                    const key = `${member.id}_${type}`;
                                    const count = counts[key] || 0;
                                    return (
                                        <div key={type} className="flex flex-col items-center gap-2 p-2 rounded-lg bg-gray-50/50 border border-gray-100/50">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{type[0]}</span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => updateCount(member.id, type as MealType, -0.5)}
                                                    className="w-6 h-6 rounded bg-white border border-gray-200 text-gray-400 hover:border-blue-200 hover:text-blue-600 flex items-center justify-center transition-all disabled:opacity-50"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className={`w-6 text-center text-sm font-bold ${count > 0 ? 'text-blue-600' : 'text-gray-300'}`}>
                                                    {count}
                                                </span>
                                                <button
                                                    onClick={() => updateCount(member.id, type as MealType, 0.5)}
                                                    className="w-6 h-6 rounded bg-white border border-gray-200 text-gray-400 hover:border-blue-200 hover:text-blue-600 flex items-center justify-center transition-all"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
