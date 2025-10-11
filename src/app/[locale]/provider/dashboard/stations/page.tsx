import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';
import { Link } from '@/i18n/routing';
import StationList from '@/components/stations/StationList';

export default async function StationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations('dashboard');
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          <TabNavigation />
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{t('stations-title')}</h2>
              <div className="flex space-x-4">
                <Link href={{ pathname: '/provider/dashboard/stations/import' }} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                  {t('stations-import_new')}
                </Link>
                <Link href={{ pathname: '/provider/dashboard/stations/add' }} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  {t('stations-add_new')}
                </Link>
              </div>
            </div>
            <StationList locale={locale} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
