'use client';

import { useTranslations } from 'next-intl';
import StationEditForm from '@/components/stations/StationEditForm';
import { Station } from '@/types/station';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function AddStationClient() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const handleSubmit = async (formData: Partial<Station>) => {
    try {
      const res = await fetch(`/${locale}/api/provider/station`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        router.push({ pathname: '/provider/dashboard/stations/[id]', params: { id: data.id } });
        return { success: true, id: data.id };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || 'Failed to create station.' };
      }
    } catch {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('stations-add_new')}</h1>
          <div className="mt-8">
            <StationEditForm
              initialData={{
                name: '',
                address: '',
                phone_number: '',
                email: '',
                payment_options: '',
                opening_hours: '',
                distance_motorway_km: null,
                distance_airport_km: null,
                distance_train_station_km: null,
                distance_bus_stop_km: null,
                parking_info: '',
                shopping_info: '',
                fuel_station_info: '',
                guest_toilet: false,
                lounge_area: false,
                greywater_disposal_info: '',
                pickup_hours: '',
                return_hours: '',
              }}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
