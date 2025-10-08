'use client';

import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';
import SetupProgress from '@/components/dashboard/SetupProgress';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          <TabNavigation />
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">{t('welcome-title')}</h2>
            <p className="text-gray-600 mt-2">
              {t('welcome-message')}
            </p>
            <SetupProgress />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
