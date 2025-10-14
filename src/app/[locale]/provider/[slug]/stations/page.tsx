import { getTranslations } from 'next-intl/server';
import { createDbConnection } from '@/lib/db/utils';
import { getStationsByProviderId } from '@/lib/db/stations';
import ProviderStationsList from '@/components/provider/ProviderStationsList';
import { Station } from '@/types/station';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const title = `Camper Intelligence - ${slug} Stations`;
  return { title };
}

export default async function StationsPage({ params }: { params: { slug: string } }) {
  const t = await getTranslations('dashboard');
  const { slug } = params;

  let stations: Station[] = [];
  let error: string | null = null;
  let connection;

  try {
    const slugParts = slug.split('-');
    const providerId = parseInt(slugParts[slugParts.length - 1]);

    if (isNaN(providerId)) {
      error = t('invalid_provider_slug');
    } else {
      connection = await createDbConnection();
      stations = await getStationsByProviderId(connection, providerId);
    }
  } catch (err) {
    console.error('Failed to fetch provider stations on server:', err);
    error = t('no_stations_found');
  } finally {
    if (connection) connection.end();
  }

  return (
    <ProviderStationsList initialStations={stations} error={error} />
  );
}
