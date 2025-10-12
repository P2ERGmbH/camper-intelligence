import { getTranslations } from 'next-intl/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAllProviders } from '@/lib/db/providers';
import AdminProvidersList from '@/components/admin/AdminProvidersList';

interface Provider {
  id: number;
  company_name: string;
  address: string;
  email: string;
  website: string;
}

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Admin Providers' };
}

export default async function AdminProvidersPage() {
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
    <AdminProvidersList initialProviders={providers} error={error} />
  );
}
