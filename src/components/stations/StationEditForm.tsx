'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Station } from '@/types/station';

interface StationEditFormProps {
  initialData: Partial<Station>;
  onSubmit: (formData: Partial<Station>) => Promise<{ success: boolean; error?: string }>;
}

export default function StationEditForm({ initialData, onSubmit }: StationEditFormProps) {
  const t = useTranslations('import');
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const { checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    const { success, error } = await onSubmit(formData);

    if (success) {
      setFeedback({ type: 'success', message: 'Station saved successfully!' });
    } else {
      setFeedback({ type: 'error', message: error || 'Failed to save station.' });
    }
    setLoading(false);
  };

  const fields = Object.keys(initialData).filter(key => !['id', 'provider_id', 'created_at', 'updated_at'].includes(key)) as (keyof Omit<Station, 'id' | 'provider_id' | 'created_at' | 'updated_at'>)[];

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
