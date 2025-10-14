import {ReactNode} from 'react';
import {setRequestLocale} from 'next-intl/server';
import AdminHeader from '@/components/admin/AdminHeader';

interface AdminLayoutProps {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function AdminLayout({children, params}: AdminLayoutProps) {
    const {locale} = await params;
    setRequestLocale(locale);


    return (
        <div className="flex flex-col h-screen bg-background">
            <AdminHeader/>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4">
                {children}
            </main>
        </div>
    );
}
