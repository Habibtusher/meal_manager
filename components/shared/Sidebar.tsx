'use client';

import Link from 'next/link';
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
    ChevronRight,
    History
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SidebarProps {
    role: 'ADMIN' | 'MEMBER';
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/admin/meals', label: 'Meal Management', icon: Utensils },
        { href: '/admin/members', label: 'Members', icon: Users },
        { href: '/admin/expenses', label: 'Expenses', icon: Receipt },
        { href: '/admin/wallet', label: 'Wallet Transactions', icon: Wallet },
        { href: '/admin/reports', label: 'Reports', icon: FileText },
        { href: '/member/history', label: 'Meal History', icon: History },
        { href: '/member/profile', label: 'Profile', icon: Settings },
    ];

    const memberLinks = [
        { href: '/member/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
        // { href: '/member/meals', label: 'Meal Participation', icon: Utensils },
        { href: '/member/history', label: 'Meal History', icon: FileText },
        { href: '/member/expenses', label: 'Expenses', icon: Receipt },
        { href: '/member/profile', label: 'Profile', icon: Settings },
    ];

    const links = role === 'ADMIN' ? adminLinks : memberLinks;

    return (
        <div className="hidden md:flex flex-col h-full bg-white border-r border-gray-200 w-64 fixed left-0 top-0 z-30">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">MealManager</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        Develop by <span className="font-semibold text-gray-500">Habibur Rahman</span>
                    </p>
                    <a
                        href="https://www.facebook.com/habibur00.rahman/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-500 hover:underline mt-1 block"
                    >
                        Facebook Profile
                    </a>
                </div>
            </div>
        </div>
    );
}
