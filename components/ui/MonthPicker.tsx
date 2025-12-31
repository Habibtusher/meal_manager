'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface MonthPickerProps {
    defaultMonth?: number; // 1-12
    defaultYear?: number;
}

export function MonthPicker({ defaultMonth, defaultYear }: MonthPickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // 2 years back, 2 years forward

    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

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
                    className="appearance-none w-[120px] bg-white border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm"
                >
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>

            <div className="relative">
                <select
                    value={String(defaultYear || currentYear)}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="appearance-none w-[100px] bg-white border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm"
                >
                    {years.map((y) => (
                        <option key={y} value={String(y)}>
                            {y}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>
        </div>
    );
}
