import {getTranslations, setRequestLocale} from 'next-intl/server';
import { Camper } from '@/types/camper';
import { getCamperFromDb } from '@/lib/db/campers';
import { getAddonsForCamperFromDb } from '@/lib/db/addons';
import { createDbConnection } from '@/lib/db/utils';
import { getAllStations } from '@/lib/db/stations';
import { getImagesForCamperWithMetadata } from '@/lib/db/images';

import CamperDetailsClient from '@/components/camper/CamperDetailsClient';
import {Station} from "@/types/station";
import {Image} from "@/types/image";


export default async function CamperEditPage({ params }: { params: Promise<{ id: string, slug: string, locale:string }> }) {
  const errorsTranslations = await getTranslations('errors');
  const  {id, slug, locale} = await params;
  setRequestLocale(locale);
  const camperIdNum = parseInt(id);

  let connection;
  let camperData: Camper | null = null;
  let allStations: Station[] = [];
  let camperImages: Image[] = [];

  try {
    connection = await createDbConnection();
    camperData = await getCamperFromDb(connection, camperIdNum);
    if (camperData) {
      camperData.addons = await getAddonsForCamperFromDb(connection, camperData.id);
      allStations = await getAllStations(connection);
      camperImages = await getImagesForCamperWithMetadata(connection, camperData.id);
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
      allStations={allStations}
      camperImages={camperImages}
      slug={slug}
    />
  );
}
