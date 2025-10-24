import TabNavigation from '@/components/layout/TabNavigation';
import AddStationClient from '@/components/stations/AddStationClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const title = `Camper Intelligence - ${slug} Add Station`;
  return { title };
}

export default async function AddStationPage() {
  const t = await getTranslations('dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <div className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('stations-add_new')}</h1>
          <TabNavigation />
          <div className="mt-8">
            <AddStationClient />
          </div>
        </div>
      </div>
    </div>
  );
}