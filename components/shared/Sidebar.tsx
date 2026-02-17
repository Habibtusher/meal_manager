'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
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
    ChevronRight,
    History,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from '../ui/ThemeToggle';

interface SidebarProps {
    role: string;
}

export function Sidebar({ role }: SidebarProps) {
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
        <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border hidden md:flex flex-col z-30 transition-colors duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 group-hover:scale-105 transition-transform">
                        <Image
                            src="/icons/icon-512x512.png"
                            alt="MealManager Logo"
                            width={40}
                            height={40}
                            className="rounded-xl"
                        />
                    </div>
                    <span className="text-xl font-bold text-foreground tracking-tight">MealManager</span>
                </Link>
                <div className="flex-shrink-0">
                    <ThemeToggle />
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                                isActive
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <link.icon
                                    className={cn(
                                        'w-5 h-5 transition-colors',
                                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                                    )}
                                />
                                {link.label}
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 animate-in slide-in-from-left-1" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border space-y-4">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    {t('signOut')}
                </button>

                <div className="pt-4 border-t border-border/50 text-center">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                        {t('developedBy')}
                    </p>
                    <p className="text-xs font-bold text-foreground mt-1">Habibur Rahman</p>
                    <a
                        href="https://www.facebook.com/habibur00.rahman/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-primary hover:text-primary/80 font-medium mt-1 inline-block transition-colors"
                    >
                        {t('facebookProfile')}
                    </a>
                </div>
            </div>
        </aside>
    );
}
