import {getTranslations, setRequestLocale} from 'next-intl/server';
import StationEditForm from '@/components/stations/StationEditForm';
import { Station } from '@/types/station';
import { getStationById, updateStation } from '@/lib/db/stations';
import mysql from 'mysql2/promise';
import {CategorizedImage} from "@/types/image";
import {getStationImages} from "@/lib/db/images";
import {Metadata} from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string, id: string }> }): Promise<Metadata> {
  const { slug, id } = params;
  const title = `Camper Intelligence - ${slug} Station: ${id}`;
  return { title };
}

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export default async function StationEditPage({ params }: { params: Promise<{ id: string, locale: string, slug: string }> }) {
  const { id, locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('import');
  let stationData:Station|null = null;
  let stationImages: CategorizedImage[] = [];
  const connection = await mysql.createConnection(dbConfig);
  try {
    stationData = await getStationById(connection, parseInt(id));
    stationImages = await getStationImages(connection, parseInt(id));
  } catch (error) {
    console.error('Failed to fetch station from DB', error);
  } finally {
    await connection.end();
  }

  const handleSubmit = async (formData: Partial<Station>) => {
    'use server';
    const connection = await mysql.createConnection(dbConfig);
    const t = await getTranslations('import');
    const slugParts = slug.split('-');
    const providerId = parseInt(slugParts[slugParts.length - 1]);

    if (isNaN(providerId)) {
      await connection.end();
      return { success: false, error: t('invalid_provider_slug') };
    }

    const updatedFormData: Omit<Station, 'id' | 'created_at' | 'updated_at'> = {
      ...formData,
      provider_id: providerId,
    } as Omit<Station, 'id' | 'created_at' | 'updated_at'>;

    try {
      const success = await updateStation(connection, parseInt(id), updatedFormData);
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
    <div className="flex flex-col min-h-screen text-gray-800 font-sans">
      <div className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('edit_form_title_station')}</h1>
          <div className="mt-8">
            {stationData ? (
              <StationEditForm station={stationData} images={stationImages} onSubmit={handleSubmit} />
            ) : (
              <p>{t('station_loading_or_not_found')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}