'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Utensils,
    Users,
    Wallet,
    Receipt,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    History,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from '../ui/ThemeToggle';

interface MobileSidebarProps {
    role: string;
}

export function MobileSidebar({ role }: MobileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const t = useTranslations('sidebar');

    const adminLinks = [
        { href: '/admin/dashboard', label: t('overview'), icon: LayoutDashboard },
        { href: '/admin/meals', label: t('mealManagement'), icon: Utensils },
        { href: '/admin/members', label: t('members'), icon: Users },
        { href: '/admin/expenses', label: t('expenses'), icon: Receipt },
        { href: '/admin/wallet', label: t('walletTransactions'), icon: Wallet },
        { href: '/admin/reports', label: t('reports'), icon: FileText },
        { href: '/member/history', label: t('mealHistory'), icon: History },
        { href: '/member/profile', label: t('profile'), icon: Settings },
    ];

    const memberLinks = [
        { href: '/member/dashboard', label: t('myDashboard'), icon: LayoutDashboard },
        // { href: '/member/meals', label: 'Meal Participation', icon: Utensils },
        { href: '/member/history', label: t('mealHistory'), icon: FileText },
        { href: '/member/expenses', label: t('expenses'), icon: Receipt },
        { href: '/member/profile', label: t('profile'), icon: Settings },
    ];

    const superAdminLinks = [
        { href: '/super-admin/dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/super-admin/organizations', label: t('organizations'), icon: Users },
        { href: '/super-admin/tickets', label: t('supportTickets'), icon: FileText },
    ];

    const links = (role as any) === 'SUPER_ADMIN' ? superAdminLinks : (role === 'ADMIN' ? adminLinks : memberLinks);

    return (
        <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
                variant="ghost"
                size="icon"
                className="p-2"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="w-6 h-6 text-foreground" />
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 w-64 bg-card z-50 shadow-xl transform transition-transform duration-300 ease-in-out border-r border-border flex flex-col transition-colors",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-4 flex items-center justify-between border-b border-border">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                        <div className="relative w-8 h-8">
                            <Image
                                src="/icons/icon-512x512.png"
                                alt="MealManager Logo"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                        </div>
                        <span className="text-xl font-bold text-foreground">MealManager</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <link.icon className={cn('w-5 h-5', isActive ? 'text-blue-600' : 'text-gray-400')} />
                                    {link.label}
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border mb-safe">
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                        {t('signOut')}
                    </button>
                    <div className="mt-4 pt-4 border-t border-border text-center">
                        <p className="text-xs text-muted-foreground">
                            {t('developedBy')} <span className="font-semibold text-foreground">Habibur Rahman</span>
                        </p>
                        <a
                            href="https://www.facebook.com/habibur00.rahman/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-500 hover:underline mt-1 block"
                        >
                            {t('facebookProfile')}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
