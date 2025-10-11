'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Camper } from '@/types/camper';
import {useParams} from "next/navigation";

interface CamperEditFormProps {
  initialData: Partial<Camper>;
  camperId?: string;
  onSubmit?: (formData: Partial<Camper>, camperId?: string) => Promise<{ success: boolean; error?: string; id?: number }>;
}

export default function CamperEditForm({ initialData, camperId, onSubmit }: CamperEditFormProps) {
  const t = useTranslations('import');
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const router = useRouter();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const { checked } = e.target as HTMLInputElement;
    setFormData((prev: Partial<Camper>) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      let result: { success: boolean; error?: string; id?: number };

      if (onSubmit) {
        result = await onSubmit(formData, camperId);
      } else {
        const method = camperId ? 'PUT' : 'POST';
        const url = camperId ? `/${locale}/api/provider/camper/${camperId}` : `/$locale}/api/provider/campers`;
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const data = await res.json();
          result = { success: true, id: data.id };
        } else {
          const data = await res.json();
          result = { success: false, error: data.error || 'Failed to save camper.' };
        }
      }

      if (result.success) {
        setFeedback({ type: 'success', message: camperId ? 'Camper saved successfully!' : 'Camper created successfully!' });
        if (!camperId && result.id) {
          router.push({
            pathname: '/provider/dashboard/campers/[id]',
            params: { id: result.id },
          });
        }
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to save camper.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const fields = Object.keys(initialData).filter(key => !['id', 'provider_id', 'created_at', 'updated_at'].includes(key)) as (keyof Omit<Camper, 'id' | 'provider_id' | 'created_at' | 'updated_at'>)[];

  return (
    <>
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" onSubmit={handleFormSubmit}>
        {fields.map((key) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
              {t(key)}
            </label>
            {typeof initialData[key] === 'boolean' ? (
              <input
                type="checkbox"
                name={key}
                id={key}
                checked={formData[key] as boolean || false}
                onChange={handleFormChange}
                className="mt-1 h-6 w-6 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            ) : (
              <input
                type="text"
                name={key}
                id={key}
                value={formData[key] as string || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            )}
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
    </>
  );
}
