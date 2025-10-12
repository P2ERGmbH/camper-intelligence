import { getTranslations } from 'next-intl/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAllCampers } from '@/lib/db/campers';
import AdminCampersList from '@/components/admin/AdminCampersList';

interface Camper {
  id: number;
  ext_id: string;
  name: string;
  rental_company_id: string;
  provider_id: number; // Foreign key to providers table
  active: boolean;
  variant: string;
  rating: number;
  rating_count: number;
  description: string;
  sleeps_adults: number;
  sleeps_children: number;
  // Add other fields as necessary from your camper table
}

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Admin Campers' };
}

export default async function AdminCampersPage() {
  const t = await getTranslations('dashboard');

  let campers: Camper[] = [];
  let error: string | null = null;
  let connection;

  try {
    connection = await createDbConnection();
    campers = await getAllCampers(connection);
  } catch (err) {
    console.error('Failed to fetch campers on server:', err);
    error = t('failed_to_load_campers'); // Assuming a new translation key for this error
  } finally {
    if (connection) connection.end();
  }

  return (
    <AdminCampersList initialCampers={campers} error={error} />
  );
}
