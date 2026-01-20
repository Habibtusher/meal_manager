'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    const switchLocale = (newLocale: string) => {
        startTransition(() => {
            // Set locale cookie
            document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

            // Refresh the page to apply new locale
            router.refresh();
            setIsOpen(false);
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                disabled={isPending}
            >
                <Languages className="w-4 h-4" />
                <span>{locale === 'en' ? 'EN' : 'বাং'}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                        onClick={() => switchLocale('en')}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${locale === 'en' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                            }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => switchLocale('bn')}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${locale === 'bn' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                            }`}
                    >
                        বাংলা
                    </button>
                </div>
            )}
        </div>
    );
}
