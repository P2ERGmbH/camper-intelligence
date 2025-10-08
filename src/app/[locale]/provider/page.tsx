import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }, { locale: 'fr' }];
}

export default async function ProviderPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('provider');

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Header />

      <main className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">{t('hero-title')}</h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">{t('hero-subtitle')}</p>
        <Link href="/provider/dashboard" className="bg-white text-blue-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105">{t('hero-cta')}</Link>
      </main>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">{t('features-title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center p-8 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mx-auto mb-6">
                <svg className="h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('features-vehicleManagement-title')}</h3>
              <p className="text-gray-600">{t('features-vehicleManagement-description')}</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mx-auto mb-6">
                <svg className="h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m-6 0h.01M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('features-imageGalleries-title')}</h3>
              <p className="text-gray-600">{t('features-imageGalleries-description')}</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mx-auto mb-6">
                <svg className="h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('features-payments-title')}</h3>
              <p className="text-gray-600">{t('features-payments-description')}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
