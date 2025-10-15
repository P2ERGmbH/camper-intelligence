import { createDbConnection } from '@/lib/db/utils';
import { getStationById } from '@/lib/db/stations';
import { getCampersByStationId, getAllCampers } from '@/lib/db/campers';
import { Station } from '@/types/station';
import { Camper } from '@/types/camper';
import { Metadata } from 'next';
import StationTile from '@/components/stations/StationTile';
import CamperTile from '@/components/campers/CamperTile';

import { getTranslations } from 'next-intl/server';

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

  let station: Station | null = null;
  let mappedCampers: Camper[] = [];
  let unmappedCampers: Camper[] = [];
  let connection;

  try {
    connection = await createDbConnection();
    station = await getStationById(connection, stationId);

    if (station) {
      mappedCampers = await getCampersByStationId(connection, stationId);
      const allCampers = await getAllCampers(connection);
      const mappedCamperIds = new Set(mappedCampers.map(c => c.id));
      unmappedCampers = allCampers.filter(c => !mappedCamperIds.has(c.id));
    }
  } catch (err) {
    console.error('Failed to fetch station details or campers:', err);
  } finally {
    if (connection) connection.end();
  }

  if (!station) {
    return <div className="flex items-center justify-center min-h-screen">Station not found.</div>;
  }

  return (
    <div className="bg-[#e8ecf3] dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">{t('station_details_title', { stationName: station.name ?? 'Unknown Station' })}</h1>

        {/* Station Tile with Toggle */}
        <div className="mb-12">
          <StationTile station={station} slug={slug} showToggle={true} currentStationId={id} />
        </div>

        {/* Mapped Campers Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('mapped_campers_title')}</h2>
          {mappedCampers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mappedCampers.map(camper => (
                <CamperTile
                  key={camper.id}
                  camper={camper}
                  slug={slug}
                  isMapped={true}
                  currentStationId={id}
                />
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
                <CamperTile
                  key={camper.id}
                  camper={camper}
                  slug={slug}
                  isMapped={false}
                  currentStationId={id}
                />
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
