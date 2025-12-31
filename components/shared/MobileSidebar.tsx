'use client';

import { useState } from 'react';
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
    Menu,
    X,
    ChevronRight,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

interface MobileSidebarProps {
    role: 'ADMIN' | 'MEMBER';
}

export function MobileSidebar({ role }: MobileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/admin/meals', label: 'Meal Management', icon: Utensils },
        { href: '/admin/members', label: 'Members', icon: Users },
        { href: '/admin/expenses', label: 'Expenses', icon: Receipt },
        { href: '/admin/wallet', label: 'Wallet Transactions', icon: Wallet },
        { href: '/admin/reports', label: 'Reports', icon: FileText },
    ];

    const memberLinks = [
        { href: '/member/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
        // { href: '/member/meals', label: 'Meal Participation', icon: Utensils },
        { href: '/member/history', label: 'Meal History', icon: FileText },
        { href: '/member/profile', label: 'Profile', icon: Settings },
    ];

    const links = role === 'ADMIN' ? adminLinks : memberLinks;

    return (
        <div className="md:hidden">
            <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="w-6 h-6 text-gray-700" />
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
                    "fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out border-r border-gray-200 flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">MealManager</span>
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

                <div className="p-4 border-t border-gray-200 mb-safe">
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
        </div>
    );
}
