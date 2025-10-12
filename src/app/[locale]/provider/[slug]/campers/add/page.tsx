'use client';

import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';
import CamperEditForm from '@/components/campers/CamperEditForm';
import { Camper } from '@/types/camper';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function AddCamperPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const handleSubmit = async (formData: Partial<Camper>) => {
    try {
      const res = await fetch(`/${locale}/api/provider/campers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        router.push({ pathname: '/provider/dashboard/campers/[id]', params: { id: data.id } });
        return { success: true, id: data.id };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || 'Failed to create camper.' };
      }
    } catch {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('campers-add_new')}</h1>
          <TabNavigation />
          <div className="mt-8">
            <CamperEditForm
              initialData={{
                name: '',
                description: '',
                sleeps_adults: null,
                sleeps_children: null,
                max_adults: null,
                max_children: null,
                passengers_seats: null,
                passengers_seats_isofix: null,
                dimension_length_min: null,
                dimension_height_min: null,
                dimension_width_min: null,
                transmission_automatic: false,
                awning: false,
                air_condition_driving_cabin: false,
                air_condition_living_area: null,
                shower_wc: null,
                tank_freshwater: null,
                tank_wastewater1: null,
                fridge: null,
                navigation: null,
                consumption: null,
                four_wd: null,
                rear_cam: null,
                tv: null,
              }}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
