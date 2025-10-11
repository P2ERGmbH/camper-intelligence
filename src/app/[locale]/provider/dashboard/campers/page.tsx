'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';
import CamperTile from '@/components/campers/CamperTile';
import {useParams} from "next/navigation";
import {Camper} from "@/types/camper";

export default function CampersPage() {
  const t = useTranslations('dashboard');
  const [campers, setCampers] = useState<Camper[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  useEffect(() => {
    const fetchCampers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/${locale}/api/provider/campers`);
        if (res.ok) {
          const data = await res.json();
          setCampers(data);
        }
      } catch (error: unknown) {
        console.error('Failed to fetch campers', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampers();
  }, [locale]);

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
                <Link href={{ pathname: '/provider/dashboard/campers/import' }} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                  {t('campers-import_new')}
                </Link>
                <Link href={{ pathname: '/provider/dashboard/campers/add' }} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  {t('campers-add_new')}
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg">
              {loading ? (
                <p>Loading campers...</p>
              ) : campers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {campers.map((camper) => (
                    <CamperTile 
                      key={camper.id} 
                      camper={camper}
                      images={camper.images || []}
                      ctaLink={{
                        pathname: '/provider/dashboard/campers/[id]',
                        params: { id: camper.id }
                      }}
                      ctaLabel="Edit"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('no_campers_found')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
