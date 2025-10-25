import { getTranslations } from 'next-intl/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAddonsByProviderIds } from '@/lib/db/addons';
import { Addon } from '@/types/addon';
import ProviderAddonsList from '@/components/provider/ProviderAddonsList';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const title = `Camper Intelligence - ${slug} Addons`;
  return { title };
}

export default async function AddonsPage({ params }: { params: { slug: string } }) {
  const t = await getTranslations('dashboard');
  const { slug } = params;

  let addons: Addon[] = [];
  let error: string | null = null;
  let connection;

  try {
    const slugParts = slug.split('-');
    const providerId = parseInt(slugParts[slugParts.length - 1]);

    if (isNaN(providerId)) {
      error = t('invalid_provider_slug');
    } else {
      connection = await createDbConnection();
      addons = await getAddonsByProviderIds(connection, [providerId]);
    }
  } catch (err) {
    console.error('Failed to fetch provider addons on server:', err);
    error = t('no_addons_available');
  } finally {
    if (connection) connection.end();
  }

  return (
    <ProviderAddonsList initialAddons={addons} error={error} />
  );
}
