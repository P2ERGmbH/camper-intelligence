import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';
import AddonManager from '@/components/addons/AddonManager';

export default function AddonsPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('addons-title')}</h1>
          <TabNavigation />
          <AddonManager />
        </div>
      </main>
      <Footer />
    </div>
  );
}
