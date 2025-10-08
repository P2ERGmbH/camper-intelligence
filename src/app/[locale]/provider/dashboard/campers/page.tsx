'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';

export default function CampersPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/provider/whoami');
        if (!res.ok) {
          router.push('/provider/login');
        }
      } catch (error) {
        console.error('Auth check failed', error);
        router.push('/provider/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          <TabNavigation />
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{t('campers-title')}</h2>
              <div className="flex space-x-4">
                <Link href="/provider/dashboard/import" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                  {t('campers-import_new')}
                </Link>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  {t('campers-add_new')}
                </button>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <p>List of campers will be displayed here.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
