import {getTranslations, setRequestLocale} from 'next-intl/server';
import {createDbConnection} from '@/lib/db/utils';
import {getAllStations} from '@/lib/db/stations';
import AdminStationsList from '@/components/admin/AdminStationsList';

import {Station} from '@/types/station';
import {Metadata} from "next";
import {getAuthenticatedUser} from "@/lib/auth";
import {redirect} from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
    return {title: 'Camper Intelligence - Admin Stations'};
}

export default async function AdminStationsPage({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    setRequestLocale(locale);

    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'admin') {
        redirect({href: '/admin/login', locale});
    }

    const t = await getTranslations('dashboard');

    let stations: Station[] = [];
    let error: string | null = null;
    let connection;

    try {
        connection = await createDbConnection();
        stations = await getAllStations(connection);
    } catch (err) {
        console.error('Failed to fetch stations on server:', err);
        error = t('failed_to_load_stations'); // Assuming a new translation key for this error
    } finally {
        if (connection) connection.end();
    }

    return (
        <AdminStationsList initialStations={stations} error={error}/>
    );
}