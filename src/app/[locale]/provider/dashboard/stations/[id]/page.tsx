import {getTranslations, setRequestLocale} from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';
import StationEditForm from '@/components/stations/StationEditForm';
import { Station } from '@/types/station';
import { getStationFromDb, updateStationInDb } from '@/lib/db/stations';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function getStation(id: string): Promise<Station | null> {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const station = await getStationFromDb(connection, id);
    return station;
  } catch (error) {
    console.error('Failed to fetch station from DB', error);
    return null;
  } finally {
    await connection.end();
  }
}

export default async function StationEditPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('import');
  const stationData = await getStation(id);

  const handleSubmit = async (formData: Partial<Station>) => {
    'use server';
    const connection = await mysql.createConnection(dbConfig);
    const t = await getTranslations('import');
    try {
      const success = await updateStationInDb(connection, id, formData);
      if (success) {
        return { success: true };
      } else {
        return { success: false, error: t('failed_to_save_station') };
      }
    } catch (error) {
      console.error('Error in handleSubmit (server action):', error);
      return { success: false, error: t('unexpected_error') };
    } finally {
      await connection.end();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('edit_form_title_station')}</h1>
          <TabNavigation />
          <div className="mt-8">
            {stationData ? (
              <StationEditForm initialData={stationData} onSubmit={handleSubmit} />
            ) : (
              <p>{t('station_loading_or_not_found')}</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
