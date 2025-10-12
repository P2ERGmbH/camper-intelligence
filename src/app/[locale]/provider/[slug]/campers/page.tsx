import { getTranslations } from 'next-intl/server';
import { createDbConnection } from '@/lib/db/utils';
import { getCampersByProviderId } from '@/lib/db/campers';
import ProviderCampersList from '@/components/provider/ProviderCampersList';

interface Camper {
  id: number;
  name: string;
  description: string;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const title = `Camper Intelligence - ${slug} Campers`;
  return { title };
}

export default async function CampersPage({ params }: { params: { slug: string } }) {
  const t = await getTranslations('dashboard');
  const { slug } = params;

  let campers: Camper[] = [];
  let error: string | null = null;
  let connection;

  try {
    const slugParts = slug.split('-');
    const providerId = parseInt(slugParts[slugParts.length - 1]);

    if (isNaN(providerId)) {
      error = t('invalid_provider_slug');
    } else {
      connection = await createDbConnection();
      campers = await getCampersByProviderId(connection, providerId);
    }
  } catch (err) {
    console.error('Failed to fetch provider campers on server:', err);
    error = t('no_campers_found');
  } finally {
    if (connection) connection.end();
  }

  return (
    <ProviderCampersList initialCampers={campers} error={error} />
  );
}