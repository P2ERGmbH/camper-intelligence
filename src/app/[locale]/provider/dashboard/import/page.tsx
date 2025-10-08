'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';

export default function ImportPage({ params }: { params: { locale: string } }) {
  const searchParams = useSearchParams();
  const [importType, setImportType] = useState<'vehicle' | 'station'>(searchParams.get('type') === 'station' ? 'station' : 'vehicle');
  const [url, setUrl] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [importAttempted, setImportAttempted] = useState(false);
  const t = useTranslations('import');
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
    const type = searchParams.get('type');
    if (type === 'station' || type === 'vehicle') {
      setImportType(type);
    }
  }, [searchParams]);

  const handleImport = async () => {
    setLoading(true);
    setFeedback({ type: '', message: '' });
    setFormData({});
    setImportAttempted(true);

    try {
      const importRes = await fetch(`/api/import-${importType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!importRes.ok) {
        throw new Error('Failed to import data.');
      }

      const data = await importRes.json();
      setFormData(data);

    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to import from URL. Please check the URL or fill the form manually.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });
    
    const apiUrl = importType === 'station' ? '/api/provider/station' : '/api/provider/vehicle';
    const successMessage = importType === 'station' ? 'Station saved successfully!' : 'Vehicle saved successfully!';
    const errorMessage = importType === 'station' ? 'Failed to save station.' : 'Failed to save vehicle.';

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: successMessage });
      } else {
        const data = await res.json();
        setFeedback({ type: 'error', message: data.error || errorMessage });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (!importAttempted) {
      return null;
    }

    const fields = importType === 'vehicle'
      ? ['name', 'description', 'sleeps_adults', 'sleeps_children', 'max_adults', 'max_children', 'passengers_seats', 'passengers_seats_isofix', 'dimension_length_min', 'dimension_height_min', 'dimension_width_min', 'transmission_automatic', 'awning', 'air_condition_driving_cabin', 'air_condition_living_area', 'shower_wc', 'tank_freshwater', 'tank_wastewater1', 'fridge', 'navigation', 'consumption', 'four_wd', 'rear_cam', 'tv']
      : ['name', 'address', 'phone_number', 'email', 'payment_options', 'opening_hours', 'distance_motorway_km', 'distance_airport_km', 'distance_train_station_km', 'distance_bus_stop_km', 'parking_info', 'shopping_info', 'fuel_station_info', 'guest_toilet', 'lounge_area', 'greywater_disposal_info', 'pickup_hours', 'return_hours'];

    return (
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          {importType === 'vehicle' ? t('edit_form_title_vehicle') : t('edit_form_title_station')}
        </h3>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" onSubmit={handleFormSubmit}>
          {fields.map((key) => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                {t(key)}
              </label>
              <input
                type="text"
                name={key}
                id={key}
                value={formData[key] || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          ))}
          <div className="md:col-span-2 lg:col-span-3 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : t('save_button')}
            </button>
          </div>
        </form>
        {feedback.message && (
          <div className={`text-sm text-center mt-4 ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback.message}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          <TabNavigation />
          <div className="mt-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">{t('import_type_label')}</label>
              <div className="mt-2 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="importType"
                    value="vehicle"
                    checked={importType === 'vehicle'}
                    onChange={() => setImportType('vehicle')}
                  />
                  <span className="ml-2">{t('import_type_vehicle')}</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="importType"
                    value="station"
                    checked={importType === 'station'}
                    onChange={() => setImportType('station')}
                  />
                  <span className="ml-2">{t('import_type_station')}</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  {t('url_label')}
                </label>
                <input
                  type="text"
                  name="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="self-end">
                <button
                  onClick={handleImport}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Importing...' : t('import_button')}
                </button>
              </div>
            </div>
            {renderForm()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}