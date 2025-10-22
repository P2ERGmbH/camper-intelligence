'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import StationEditForm from '@/components/stations/StationEditForm';
import { Station } from '@/types/station';
import {useParams} from "next/navigation";

export default function ImportStationsClient() {
  const t = useTranslations('import');
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [formData, setFormData] = useState<Partial<Station>>({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [importAttempted, setImportAttempted] = useState(false);

  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const handleImport = async () => {
    setLoading(true);
    setFeedback({ type: '', message: '' });
    setFormData({});

    try {
      const importRes = await fetch(`/${locale}/api/provider/stations/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!importRes.ok) {
        throw new Error('Failed to import data.');
      }

      const data = await importRes.json();
      setFormData(data);

    } catch (error: unknown) {
      console.error(error);
      setFeedback({ type: 'error', message: 'Failed to import from URL. Please check the URL or fill the form manually.' });
    } finally {
      setLoading(false);
    }
    setImportAttempted(true);
  };

  const handleFormSubmit = async (formData: Partial<Station>) => {
    const res = await fetch(`/${locale}/api/provider/station`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      router.push({
        pathname: '/provider/dashboard/stations/[id]',
        params: { id: data.id },
      });
      return { success: true };
    } else {
      const data = await res.json();
      return { success: false, error: data.error || 'Failed to save station.' };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          <div className="mt-8">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">{t('url_label')}</label>
                <input type="text" name="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
              <div className="self-end">
                <button onClick={handleImport} disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                  {loading ? 'Importing...' : t('import_button')}
                </button>
              </div>
            </div>
            {importAttempted && <StationEditForm station={formData} onSubmit={handleFormSubmit} />}
            {feedback.message && <div className={`text-sm text-center mt-4 ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
