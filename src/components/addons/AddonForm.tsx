'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Addon } from '@/types/addon';
import { useParams } from 'next/navigation';

interface AddonFormProps {
  id: number;
  initialCamperAddons: Addon[];
}

export default function AddonForm({ id, initialCamperAddons }: AddonFormProps) {
  const t = useTranslations('addons');
  const [allAddons, setAllAddons] = useState<Addon[]>([]);
  const [camperAddons, setCamperAddons] = useState<number[]>(initialCamperAddons ? initialCamperAddons.map(addon => addon.id).filter((id): id is number => id !== undefined) : []); // Stores addon IDs associated with the camper
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [newAddon, setNewAddon] = useState<Partial<Addon>>({ name: '', price_per_unit: 0, category: '' });

  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const fetchAddons = useCallback(async () => {
    setLoading(true);
    try {
      const allAddonsRes = await fetch(`/${locale}/api/provider/addons`);
      const allAddonsData: Addon[] = await allAddonsRes.json();
      setAllAddons(allAddonsData);

      if (!initialCamperAddons) { // Only fetch camper-specific addons if not provided initially
        const camperAddonsRes = await fetch(`/${locale}/api/provider/camper/${id}/addons`);
        const camperAddonsData: Addon[] = await camperAddonsRes.json();
        setCamperAddons(camperAddonsData.map(addon => addon.id));
      }
    } catch (error) {
      console.error('Failed to fetch addons:', error);
      setFeedback({ type: 'error', message: t('fetch_error') });
    } finally {
      setLoading(false);
    }
    }, [id, locale, t, initialCamperAddons]);

  useEffect(() => {
    fetchAddons();
  }, [fetchAddons]);

  const handleNewAddonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAddon(prev => ({ ...prev, [name]: name === 'price_per_unit' ? parseFloat(value) : value }));
  };

  const handleCreateAddon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      const res = await fetch(`/${locale}/api/provider/addons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddon),
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: t('addon_created_success') });
        setNewAddon({ name: '', price_per_unit: 0, category: '' });
        fetchAddons(); // Refresh the list of all addons
      } else {
        const data = await res.json();
        setFeedback({ type: 'error', message: data.error || t('addon_created_error') });
      }
    } catch (error) {
      console.error('Failed to create addon:', error);
      setFeedback({ type: 'error', message: t('addon_created_error') });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAddon = async (addonId: number, isAssociated: boolean) => {
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      const method = isAssociated ? 'DELETE' : 'POST';
      const res = await fetch(`/${locale}/api/provider/camper/${id}/addons`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addonId }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: isAssociated ? t('addon_disassociated') : t('addon_associated') });
        fetchAddons(); // Refresh associations
      } else {
        const data = await res.json();
        setFeedback({ type: 'error', message: data.error || t('addon_association_error') });
      }
    } catch (error) {
      console.error('Failed to toggle addon association:', error);
      setFeedback({ type: 'error', message: t('addon_association_error') });
    } finally {
      setLoading(false);
    }
  };

  const categories = ['service', 'basic_facilities', 'insurance', 'included_miles', 'other'];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">{t('manage_addons')}</h2>
      {feedback.message && (
        <div className={`text-sm text-center mt-4 ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback.message}
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">{t('create_new_addon')}</h3>
        <form onSubmit={handleCreateAddon} className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label htmlFor="addonName" className="block text-sm font-medium text-gray-700">{t('addon_name')}</label>
            <input
              type="text"
              name="name"
              id="addonName"
              value={newAddon.name || ''}
              onChange={handleNewAddonChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="addonCategory" className="block text-sm font-medium text-gray-700">{t('category')}</label>
            <select
              name="category"
              id="addonCategory"
              value={newAddon.category || ''}
              onChange={handleNewAddonChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">{t('select_category')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{t(cat)}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="addonPrice" className="block text-sm font-medium text-gray-700">{t('price_per_unit')}</label>
            <input
              type="number"
              name="price_per_unit"
              id="addonPrice"
              value={newAddon.price_per_unit || 0}
              onChange={handleNewAddonChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              step="0.01"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="addonDescription" className="block text-sm font-medium text-gray-700">{t('description')}</label>
            <input
              type="text"
              name="description"
              id="addonDescription"
              value={newAddon.description || ''}
              onChange={handleNewAddonChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="addonMaxQuantity" className="block text-sm font-medium text-gray-700">{t('max_quantity')}</label>
            <input
              type="number"
              name="max_quantity"
              id="addonMaxQuantity"
              value={newAddon.max_quantity || 1}
              onChange={handleNewAddonChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? t('creating') : t('create_addon')}
          </button>
        </form>
      </div>

      <h3 className="text-lg font-medium mb-2">{t('available_addons')}</h3>
      {loading && <p>{t('loading_addons')}</p>}
      {!loading && allAddons.length === 0 && <p>{t('no_addons_available')}</p>}
      {!loading && allAddons.length > 0 && (
        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
          {allAddons.map((addon) => (
            <li key={addon.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{addon.name} ({addon.price_per_unit}€)</p>
                {addon.description && <p className="text-sm text-gray-500">{addon?.description}</p>}
              </div>
              <input
                type="checkbox"
                checked={camperAddons.includes(addon.id)}
                onChange={() => handleToggleAddon(addon.id, camperAddons.includes(addon.id))}
                className="h-6 w-6 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                disabled={loading}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
