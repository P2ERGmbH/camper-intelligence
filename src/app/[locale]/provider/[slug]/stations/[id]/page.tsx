import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createDbConnection } from '@/lib/db/utils';
import { getStationById } from '@/lib/db/stations';
import { getCampersByStationId, getCampersByProviderId } from '@/lib/db/campers';
import { getProviderById } from '@/lib/db/providers';
import { Station } from '@/types/station';
import { Camper } from '@/types/camper';
import {Provider} from "@/types/provider";
import StationTile from '@/components/stations/StationTile';
import CamperTile from '@/components/campers/CamperTile';
import CamperStationAssignmentButtons from '@/components/campers/CamperStationAssignmentButtons';
import StationStatusToggleClient from '@/components/stations/StationStatusToggleClient';

export async function generateMetadata({ params }: { params: { slug: string, id: string } }): Promise<Metadata> {
  const { slug, id } = params;
  const title = `Camper Intelligence - ${slug} Station: ${id}`;
  const description = `Details for station ${id} of provider ${slug}`;
  return { title, description };
}

export default async function StationDetailsPage({ params }: { params: { slug: string, id: string } }) {
  const t = await getTranslations('dashboard');
  const { slug, id } = params;
  const stationId = parseInt(id);

  const providerIdFromSlug = parseInt(slug.substring(slug.lastIndexOf('-') + 1));

  let station: Station | null = null;
  let provider: Provider | null = null;
  let mappedCampers: Camper[] = [];
  let unmappedCampers: Camper[] = [];
  let connection;

  try {
    connection = await createDbConnection();
    station = await getStationById(connection, stationId);
    provider = await getProviderById(connection, providerIdFromSlug);

    if (station && provider) {
      mappedCampers = await getCampersByStationId(connection, stationId);
      const allProviderCampers = await getCampersByProviderId(connection, provider.id);
      const mappedCamperIds = new Set(mappedCampers.map(c => c.id));
      unmappedCampers = allProviderCampers.filter(c => !mappedCamperIds.has(c.id));
    }
  } catch (err) {
    console.error('Failed to fetch station details or campers:', err);
  } finally {
    if (connection) connection.end();
  }

  if (!station || !provider) {
    return <div className="flex items-center justify-center min-h-screen">Station or Provider not found.</div>;
  }

  return (
    <div className="bg-[#e8ecf3] dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">{t('station_details_title', { stationName: station.name ?? 'Unknown Station' })}</h1>

        {/* Station Tile with Toggle */}
        <div className="mb-12">
          <StationTile station={station} slug={slug}>
            <StationStatusToggleClient stationId={station.id} initialStatus={station.active} slug={slug} currentStationId={id} />
          </StationTile>
        </div>

        {/* Mapped Campers Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('mapped_campers_title')}</h2>
          {mappedCampers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mappedCampers.map(camper => (
                <CamperTile key={camper.id} camper={camper}>
                  <CamperStationAssignmentButtons
                    camper={camper}
                    slug={slug}
                    isMapped={true}
                    currentStationId={id}
                  />
                </CamperTile>
              ))}
            </div>
          ) : (
            <p>{t('no_mapped_campers')}</p>
          )}
        </section>

        {/* Unmapped Campers Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t('unmapped_campers_title')}</h2>
          {unmappedCampers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unmappedCampers.map(camper => (
                <CamperTile key={camper.id} camper={camper}>
                  <CamperStationAssignmentButtons
                    camper={camper}
                    slug={slug}
                    isMapped={false}
                    currentStationId={id}
                  />
                </CamperTile>
              ))}
            </div>
          ) : (
            <p>{t('no_unmapped_campers')}</p>
          )}
        </section>
      </div>
    </div>
  );
}
