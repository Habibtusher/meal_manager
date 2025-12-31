import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/shared/Sidebar';
import { MobileSidebar } from '@/components/shared/MobileSidebar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar role={session.user.role} />
            <main className="md:pl-64 min-h-screen transition-all duration-300">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <MobileSidebar role={session.user.role} />
                        <h2 className="text-lg font-semibold text-gray-800">
                            {session.user.role === 'ADMIN' ? 'Admin Dashboard' : 'Member Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                            <p className="text-xs text-gray-500">{session.user.email}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
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
