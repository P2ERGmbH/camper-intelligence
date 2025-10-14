import AdminImportProvidersClient from '@/components/admin/AdminImportProvidersClient';
import {Metadata} from "next";
import {getAuthenticatedUser} from "@/lib/auth";
import {setRequestLocale} from "next-intl/server";
import {redirect} from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
    return {title: 'Camper Intelligence - Admin Provider Import'};
}

export default async function AdminImportProvidersPage({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    setRequestLocale(locale);

    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'admin') {
        redirect({href: '/admin/login', locale});
    }

    // No server-side data fetching for this page, as the client component handles it.
    // We can pass initial messages/errors if needed, but for now, it starts clean.

    return (
        <AdminImportProvidersClient/>
    );
}
