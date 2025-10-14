import {getTranslations, setRequestLocale} from 'next-intl/server';
import TabNavigation from '@/components/layout/TabNavigation';
import CamperEditForm from '@/components/campers/CamperEditForm';
import ImageUploader from '@/components/images/ImageUploader';
import AddonForm from '@/components/addons/AddonForm';
import { Camper } from '@/types/camper';
import { getCamperFromDb } from '@/lib/db/campers';
import { createDbConnection } from '@/lib/db/utils';
import mysql from 'mysql2/promise';

async function getCamper(id: string): Promise<Camper | null> {
  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const camper = await getCamperFromDb(connection, id);
    return camper;
  } catch (error) {
    console.error('Failed to fetch camper from DB', error);
    return null;
  } finally {
    if (connection) await connection.end();
  }
}

export default async function CamperEditPage({ params }: { params: Promise<{ id: string, locale:string }> }) {
  const importTranslations = await getTranslations('import');
  const errorsTranslations = await getTranslations('errors');
  const  {id, locale} = await params;
  setRequestLocale(locale);
  const camperIdNum = parseInt(id);
  const camperData = await getCamper(id);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{importTranslations('edit_form_title_vehicle')}</h1>
          <TabNavigation />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {camperData ? (
                <CamperEditForm initialData={camperData} id={camperIdNum} />
              ) : (
                <p>{errorsTranslations('camper_loading_or_not_found')}</p>
              )}
            </div>
            <div>
              <ImageUploader parentId={parseInt(id)} parentType="camper" />
            </div>
          </div>
          <div className="mt-8">
            <AddonForm camperId={parseInt(id)} />
          </div>
        </div>
      </main>
    </div>
  );
}
