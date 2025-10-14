'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';
import { Camper } from '@/types/camper';
import CamperEditForm from '@/components/campers/CamperEditForm';
import AddonForm from '@/components/addons/AddonForm';
import {useParams} from "next/navigation";
import {Addon} from "@/types/addon";
import { Link } from '@/i18n/routing';

const categorizeAddon = (addonName: string): string => {
  const lowerCaseName = addonName.toLowerCase();
  if (lowerCaseName.includes('service') || lowerCaseName.includes('wartung')) return 'service';
  if (lowerCaseName.includes('facilities') || lowerCaseName.includes('ausstattung')) return 'basic_facilities';
  if (lowerCaseName.includes('insurance') || lowerCaseName.includes('versicherung')) return 'insurance';
  if (lowerCaseName.includes('miles') || lowerCaseName.includes('kilometer')) return 'included_miles';
  return 'other';
};

export default function VehicleImportPage() {
  const t = useTranslations('import');
  const [url, setUrl] = useState('');
  const [formData, setFormData] = useState<Partial<Camper>>({});
  const [importedAddons, setImportedAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [importAttempted, setImportAttempted] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);

  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const handleImport = async () => {
    setLoading(true);
    setFormData({});
    setImportedAddons([]);
    setImportAttempted(true);

    try {
      const importRes = await fetch(`/${locale}/api/provider/campers/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!importRes.ok) {
        setFeedback({ type: 'error', message: t('import_failed_url') });
        return;
      }

      const data = await importRes.json();
      const { addons, ...camperData } = data; // Assuming addons are part of the imported data
      setFormData(camperData);
      if (addons) {
        let tempIdCounter = -1;
        const categorizedAddons = addons.map((addon: Partial<Addon>): Addon => ({
          id: addon.id ?? tempIdCounter--,
          name: addon.name || '',
          category: categorizeAddon(addon.name || ''),
          description: addon.description || null,
          price_per_unit: addon.price_per_unit || 0,
          max_quantity: addon.max_quantity || null,
          created_at: addon.created_at || new Date().toISOString(),
          updated_at: addon.updated_at || new Date().toISOString(),
        }));
        setImportedAddons(categorizedAddons);
      }

    } catch (error) {
      console.error('Error during import:', error);
      setFeedback({ type: 'error', message: t('import_failed_url') });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          <TabNavigation />
          <div className="mt-8">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">{t('url_label')}</label>
                <input type="text" name="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
              <div className="self-end">
                <button onClick={handleImport} disabled={loading || !url} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                  {loading ? 'Importing...' : t('import_button')}
                </button>
              </div>
            </div>
            {feedback.message && feedback.type === 'error' && (
              <div className="text-red-600 text-sm mt-4 text-center">{feedback.message}</div>
            )}
            {importAttempted && Object.keys(formData).length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">{t('edit_form_title_vehicle')}</h3>
                <CamperEditForm
                  initialData={formData}
                  onSuccess={(data) => {
                    setId(data.id);
                    setFeedback({ type: 'success', message: t('camper_created_success') });
                  }}
                />
                {id && (
                  <div className="mt-8">
                    <AddonForm id={id} initialCamperAddons={importedAddons} />
                  </div>
                )}
                <div className="mt-8 text-center">
                  <Link href={{ pathname: '/provider/[slug]/campers/add', params: { slug: params.slug as string } }} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400">
                    {t('add_from_scratch')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}