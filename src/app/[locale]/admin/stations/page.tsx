import { getTranslations } from 'next-intl/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAllStations } from '@/lib/db/stations';
import AdminStationsList from '@/components/admin/AdminStationsList';

interface Station {
  id: number;
  ext_id: string;
  name: string;
  city: string;
  country: string;
  active: boolean;
}

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Admin Stations' };
}

export default async function AdminStationsPage() {
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
    <AdminStationsList initialStations={stations} error={error} />
  );
}