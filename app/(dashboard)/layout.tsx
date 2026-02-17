import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/shared/Sidebar';
import { MobileSidebar } from '@/components/shared/MobileSidebar';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
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
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <MobileSidebar role={session.user.role} />
                        <h2 className="text-lg font-semibold text-foreground">
                            {(session.user.role as any) === 'SUPER_ADMIN' ? t('superAdminPanel') : (session.user.role === 'ADMIN' ? t('adminDashboard') : t('memberDashboard'))}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                            <p className="text-xs text-muted-foreground">{session.user.email}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-border">
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
