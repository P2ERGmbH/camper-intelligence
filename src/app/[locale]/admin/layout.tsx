import { ReactNode } from 'react';
import { getAuthenticatedUser } from '@/lib/auth';
import { Link } from '@/i18n/routing';
import { headers } from 'next/headers';
import NotAuthorized from '@/components/auth/NotAuthorized';

export const metadata = {
  title: 'Camper Intelligence - Admin Dashboard',
};

interface AdminLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path');

  // If we are on the admin login page, don't perform auth check to prevent redirect loop
  if (pathname === `/${locale}/login/admin`) {
    return <>{children}</>;
  }

  const user = await getAuthenticatedUser();

  if (!user || user.role !== 'admin') {
    return <NotAuthorized />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card text-card-foreground p-4 space-y-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav>
          <ul className="space-y-2">
            <li><Link href={{ pathname: '/admin/providers' }} className="block hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded">Providers</Link></li>
            <li><Link href={{ pathname: '/admin/cu-camper-import/providers' }} className="block hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded">Import CU Camper Providers</Link></li>
            <li><Link href={{ pathname: '/admin/cu-camper-import/campers' }} className="block hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded">Import CU Camper Campers</Link></li>
            <li><Link href={{ pathname: '/admin/cu-camper-import/stations' }} className="block hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded">Import CU Camper Stations</Link></li>
            <li><Link href={{ pathname: '/admin/campers' }} className="block hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded">Campers</Link></li>
            <li><Link href={{ pathname: '/admin/stations' }} className="block hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded">Stations</Link></li>
            <li><Link href={{ pathname: '/admin/migrate' }} className="block hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded">Database Migrations</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-background border-b shadow-sm">
          <h1 className="text-xl font-semibold text-foreground">Dashboard Overview</h1>
          {/* User info or logout can go here */}
          <div className="text-foreground">Logged in as: {user.email}</div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
