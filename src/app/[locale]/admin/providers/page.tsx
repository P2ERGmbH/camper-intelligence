import {getTranslations, setRequestLocale} from 'next-intl/server';
import {createDbConnection} from '@/lib/db/utils';
import {getAllProviders} from '@/lib/db/providers';
import AdminProvidersList from '@/components/admin/AdminProvidersList';
import {getAuthenticatedUser} from "@/lib/auth";
import {Metadata} from "next";
import {redirect} from "@/i18n/routing";

interface Provider {
    id: number;
    company_name: string;
    address: string;
    email: string;
    website: string;
}

export async function generateMetadata(): Promise<Metadata> {
    return {title: 'Camper Intelligence - Admin Providers'};
}

export default async function AdminProvidersPage({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    setRequestLocale(locale);

    const user = await getAuthenticatedUser();
    console.log(user);
    if (!user || user.role !== 'admin') {
        redirect({href: '/admin/login', locale});
    }
    const t = await getTranslations('dashboard');

    let providers: Provider[] = [];
    let error: string | null = null;
    let connection;

    try {
        connection = await createDbConnection();
        providers = await getAllProviders(connection);
    } catch (err) {
        console.error('Failed to fetch providers on server:', err);
        error = t('failed_to_load_providers'); // Assuming a new translation key for this error
    } finally {
        if (connection) connection.end();
    }

    return (
        <AdminProvidersList initialProviders={providers} error={error}/>
    );
}
