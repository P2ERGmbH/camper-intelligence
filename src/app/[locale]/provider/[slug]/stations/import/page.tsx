import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';
import ImportStationsClient from '@/components/stations/ImportStationsClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const title = `Camper Intelligence - ${slug} Import Stations`;
  return { title };
}

export default async function StationImportPage() {
  const t = await getTranslations('import');

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          <TabNavigation />
          <div className="mt-8">
            <ImportStationsClient />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}