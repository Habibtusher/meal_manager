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
    History,
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
        { href: '/member/history', label: 'Meal History', icon: FileText },
        { href: '/member/expenses', label: 'Expenses', icon: Receipt },
        { href: '/member/profile', label: 'Profile', icon: Settings },
    ];

    const links = role === 'ADMIN' ? adminLinks : memberLinks;

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-30">
            <div className="p-6 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <Utensils className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">MealManager</span>
                </Link>
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
                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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

            <div className="p-4 border-t border-gray-100 space-y-4">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    Sign Out
                </button>
                
                <div className="pt-4 border-t border-gray-50 text-center">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                        Developed by
                    </p>
                    <p className="text-xs font-bold text-gray-900 mt-1">Habibur Rahman</p>
                    <a
                        href="https://www.facebook.com/habibur00.rahman/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-500 hover:text-blue-600 font-medium mt-1 inline-block transition-colors"
                    >
                        Facebook Profile
                    </a>
                </div>
            </div>
        </aside>
    );
}
