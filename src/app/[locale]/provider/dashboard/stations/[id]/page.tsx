'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';

export default function StationEditPage({ params }: { params: { id: string } }) {
  const t = useTranslations('import');
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
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
    const fetchStation = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/provider/station/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData(data);
        }
      } catch (error) {
        console.error('Failed to fetch station', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStation();
  }, [params.id]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      const res = await fetch(`/api/provider/station/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: 'Station saved successfully!' });
      } else {
        const data = await res.json();
        setFeedback({ type: 'error', message: data.error || 'Failed to save station.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const fields = ['name', 'address', 'phone_number', 'email', 'payment_options', 'opening_hours', 'distance_motorway_km', 'distance_airport_km', 'distance_train_station_km', 'distance_bus_stop_km', 'parking_info', 'shopping_info', 'fuel_station_info', 'guest_toilet', 'lounge_area', 'greywater_disposal_info', 'pickup_hours', 'return_hours'];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('edit_form_title_station')}</h1>
          <TabNavigation />
          <div className="mt-8">
            {loading ? (
              <p>Loading station data...</p>
            ) : (
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
            )}
            {feedback.message && (
              <div className={`text-sm text-center mt-4 ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {feedback.message}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
