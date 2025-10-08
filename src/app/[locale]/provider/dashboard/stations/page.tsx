'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';

export default function StationsPage() {
  const t = useTranslations('dashboard');
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/provider/stations');
        if (res.ok) {
          const data = await res.json();
          setStations(data);
        }
      } catch (error) {
        console.error('Failed to fetch stations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

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
                <Link href="/provider/dashboard/import?type=station" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                  {t('stations-import_new')}
                </Link>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  {t('stations-add_new')}
                </button>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              {loading ? (
                <p>Loading stations...</p>
              ) : stations.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {stations.map((station) => (
                    <li key={station.id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{station.name}</p>
                        <p className="text-sm text-gray-600">{station.address}</p>
                      </div>
                      <Link href={`/provider/dashboard/stations/${station.id}`} className="text-sm text-indigo-600 hover:text-indigo-900">Edit</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No stations found. Add one to get started.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
