'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface DatePickerProps {
    defaultValue: string;
}

export default function DatePicker({ defaultValue }: DatePickerProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('date', e.target.value);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <input
            type="date"
            name="date"
            defaultValue={defaultValue}
            onChange={handleChange}
            className="bg-gray-50 border-gray-200 rounded-lg px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
    );
}
