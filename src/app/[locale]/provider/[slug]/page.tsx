import { createDbConnection } from '@/lib/db/utils';
import { getProviderById } from '@/lib/db/providers';
import { getCampersByProviderIds } from '@/lib/db/campers';
import { getStationsByProviderIds } from '@/lib/db/stations';
import { getAddonsByProviderIds } from '@/lib/db/addons';
import { Provider } from '@/types/provider';
import { CamperWIthTileImage } from '@/types/camper';
import { Station } from '@/types/station';
import { Addon } from '@/types/addon';
import { notFound } from 'next/navigation';
import ProviderDetailsWrapper from '@/components/provider/ProviderDetailsWrapper';
import { getProviderIdFromSlug } from '@/lib/utils/slug';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = `Camper Intelligence - Provider Portal: ${slug}`;
  return { title };
}

export default async function ProviderOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const providerId = getProviderIdFromSlug(slug);

  if (providerId === null) {
    notFound();
  }

  const connection = await createDbConnection();
  let provider: Provider | null = null;
  let campers: CamperWIthTileImage[] = [];
  let stations: Station[] = [];
  let addons: Addon[] = [];

  try {
    provider = await getProviderById(connection, providerId);
    if (provider) {
      campers = await getCampersByProviderIds(connection, [provider.id]);
      stations = await getStationsByProviderIds(connection, [provider.id]);
      addons = await getAddonsByProviderIds(connection, [provider.id]);
    }
  } catch (error) {
    console.error('Error fetching provider data:', error);
  } finally {
    await connection.end();
  }

  if (!provider) {
    notFound();
  }

  return (
    <ProviderDetailsWrapper
      provider={provider}
      campers={campers.slice(0, 4)}
      stations={stations.slice(0, 4)}
      addons={addons.slice(0, 4)}
    />
  );
}