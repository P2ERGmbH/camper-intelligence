import {getTranslations, setRequestLocale} from 'next-intl/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAllCampers } from '@/lib/db/campers';
import { getAllProviders } from '@/lib/db/providers';
import AdminCampersList from '@/components/admin/AdminCampersList';

import { Camper } from '@/types/camper';
import {Metadata} from "next";
import {getAuthenticatedUser} from "@/lib/auth";
import {redirect} from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Camper Intelligence - Admin Campers' };
}

export default async function AdminCampersPage({params}: { params: Promise<{ locale: string }> }) {
  const {locale} = await params;
  setRequestLocale(locale);

  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    redirect({href: '/admin/login', locale});
  }
  const t = await getTranslations('dashboard');

  let campers: (Camper & { providerName?: string })[] = [];
  let error: string | null = null;
  let connection;

  try {
    connection = await createDbConnection();
    const [allCampers, allProviders] = await Promise.all([
      getAllCampers(connection),
      getAllProviders(connection),
    ]);

    const providerMap = new Map<number, string>();
    allProviders.forEach(provider => {
      providerMap.set(provider.id, provider.company_name);
    });

    campers = allCampers.map(camper => ({
      ...camper,
      providerName: camper.provider_id ? providerMap.get(camper.provider_id) : 'N/A',
    }));

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
