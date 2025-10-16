import {getTranslations, setRequestLocale} from 'next-intl/server';
import { Camper } from '@/types/camper';
import { getCamperFromDb } from '@/lib/db/campers';
import { getAddonsForCamperFromDb } from '@/lib/db/addons';
import { createDbConnection } from '@/lib/db/utils';
import { getStationsByProviderId } from '@/lib/db/stations';
import {getImagesForCamperWithMetadata, getProviderLogo} from '@/lib/db/images';

import CamperDetailsClient from '@/components/camper/CamperDetailsClient';
import {Station} from "@/types/station";
import {Image} from "@/types/image";
import {getProviderIdFromSlug} from "@/lib/utils/slug";


export default async function CamperEditPage({ params }: { params: Promise<{ id: string, slug: string, locale:string }> }) {
  const errorsTranslations = await getTranslations('errors');
  const  {id, slug, locale} = await params;
  setRequestLocale(locale);
  const camperIdNum = parseInt(id);
  const providerId = getProviderIdFromSlug(slug);

  let connection;
  let camperData: Camper | null = null;
  let providerStations: Station[] = [];
  let camperImages: Image[] = [];
  let providerLogo: Image|null = null;

  try {
    connection = await createDbConnection();
    camperData = await getCamperFromDb(connection, camperIdNum);
    if (camperData) {
      camperData.addons = await getAddonsForCamperFromDb(connection, camperData.id);
      providerStations = await getStationsByProviderId(connection, providerId);
      camperImages = await getImagesForCamperWithMetadata(connection, camperData.id);
      providerLogo = await getProviderLogo(connection, providerId);
    }
  } catch (error) {
    console.error('Failed to fetch data for camper details page:', error);
  } finally {
    if (connection) connection.end();
  }

  if (!camperData) {
    return <p>{errorsTranslations('camper_loading_or_not_found')}</p>;
  }

  return (
    <CamperDetailsClient
      initialCamper={camperData}
      providerStations={providerStations}
      providerLogo={providerLogo}
      camperImages={camperImages}
      slug={slug}
    />
  );
}
