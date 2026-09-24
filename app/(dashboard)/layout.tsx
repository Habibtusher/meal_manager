import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/shared/Sidebar';
import { MobileSidebar } from '@/components/shared/MobileSidebar';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import Link from 'next/link';
import { Utensils, Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const t = await getTranslations('sidebar');

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar role={session.user.role} />
            <main className="md:pl-64 min-h-screen transition-all duration-300">
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <MobileSidebar role={session.user.role} />
                        <h2 className="hidden md:block text-base sm:text-lg font-semibold text-foreground truncate">
                            {(session.user.role as any) === 'SUPER_ADMIN' ? t('superAdminPanel') : (session.user.role === 'ADMIN' ? t('adminDashboard') : t('memberDashboard'))}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        {session.user.role === 'ADMIN' && (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/admin/meals"
                                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm active:scale-95"
                                    title={t('addMeal')}
                                >
                                    <Utensils className="w-3.5 h-3.5" />
                                    <span>{t('addMeal')}</span>
                                </Link>
                                <Link
                                    href="/admin/expenses"
                                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border hover:border-emerald-500/40 transition-all shadow-xs active:scale-95"
                                    title={t('addCost')}
                                >
                                    <Plus className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>{t('addCost')}</span>
                                </Link>
                            </div>
                        )}
                        <LanguageSwitcher />
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                            <p className="text-xs text-muted-foreground">{session.user.email}</p>
                        </div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-border text-sm sm:text-base flex-shrink-0">
                            {session.user.name?.[0].toUpperCase()}
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
