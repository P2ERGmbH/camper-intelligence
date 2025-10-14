import { getTranslations } from 'next-intl/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAllCampers } from '@/lib/db/campers';
import AdminCampersList from '@/components/admin/AdminCampersList';

import { Camper } from '@/types/camper';
import {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata> {
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
