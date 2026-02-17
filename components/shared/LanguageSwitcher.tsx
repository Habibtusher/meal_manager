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
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border hover:bg-accent hover:text-accent-foreground transition-all text-sm font-medium text-foreground shadow-sm"
                disabled={isPending}
            >
                <Languages className="w-4 h-4" />
                <span>{locale === 'en' ? 'EN' : 'বাং'}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-card rounded-lg shadow-xl border border-border py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                        onClick={() => switchLocale('en')}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${locale === 'en' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                            }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => switchLocale('bn')}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${locale === 'bn' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                            }`}
                    >
                        বাংলা
                    </button>
                </div>
            )}
        </div>
    );
}
