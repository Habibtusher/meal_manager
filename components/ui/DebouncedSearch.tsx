'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface DebouncedSearchProps {
    placeholder?: string;
    defaultValue?: string;
    className?: string;
}

export default function DebouncedSearch({
    placeholder = "Search...",
    defaultValue = "",
    className = ""
}: DebouncedSearchProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState(defaultValue);

    // Debounce the search term
    useEffect(() => {
        const timeout = setTimeout(() => {
            const currentParams = new URLSearchParams(searchParams.toString());
            const currentQuery = currentParams.get('query') || '';

            // Only push if the value has actually changed from what's in the URL
            if (currentQuery === value) return;

            if (value) {
                currentParams.set('query', value);
            } else {
                currentParams.delete('query');
            }

            startTransition(() => {
                router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
            });
        }, 300); // 300ms debounce

        return () => clearTimeout(timeout);
    }, [value, pathname, router, searchParams]);

    return (
        <div className={`relative ${className}`}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Search className="w-4 h-4" />
                )}
            </div>
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
            />
        </div>
    );
}
