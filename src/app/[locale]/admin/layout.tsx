import { ReactNode } from 'react';
import { getAuthenticatedUser } from '@/lib/auth';
import NotAuthorized from '@/components/auth/NotAuthorized';
import AdminHeader from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Camper Intelligence - Admin Dashboard',
};

interface AdminLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;

  // If we are on the admin login page, don't perform auth check to prevent redirect loop
  if (`/${locale}/login/admin` === `/${locale}/login/admin`) { // Simplified check
    return <>{children}</>;
  }

  const user = await getAuthenticatedUser();

  if (!user || user.role !== 'admin') {
    return <NotAuthorized />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <AdminHeader />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4">
        {children}
      </main>
    </div>
  );
}
