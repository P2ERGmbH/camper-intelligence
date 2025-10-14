'use client';

import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';
import CamperEditForm from '@/components/campers/CamperEditForm';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function AddCamperPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const params = useParams();
  // const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale; // Removed as locale is not used directly in this component


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
              onSuccess={(data) => {
                router.push({ pathname: '/provider/[slug]/campers/[id]', params: { slug: params.slug as string, id: data.id } });
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
