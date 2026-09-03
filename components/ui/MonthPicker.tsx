'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface MonthPickerProps {
    defaultMonth?: number; // 1-12
    defaultYear?: number;
}

export function MonthPicker({ defaultMonth, defaultYear }: MonthPickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('months');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // 2 years back, 2 years forward

    const monthKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    const handleMonthChange = (val: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('month', val);
        router.push(`?${params.toString()}`);
    };

    const handleYearChange = (val: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('year', val);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex gap-2">
            <div className="relative">
                <select
                    value={String(defaultMonth || new Date().getMonth() + 1)}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="appearance-none w-[130px] bg-background border border-border text-foreground py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-card focus:border-primary text-sm transition-colors"
                >
                    {monthKeys.map((key) => (
                        <option key={key} value={key} className="bg-card text-foreground">
                            {t(key)}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>

            <div className="relative">
                <select
                    value={String(defaultYear || currentYear)}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="appearance-none w-[100px] bg-background border border-border text-foreground py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-card focus:border-primary text-sm transition-colors"
                >
                    {years.map((y) => (
                        <option key={y} value={String(y)} className="bg-card text-foreground">
                            {y}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>
        </div>
    );
}
