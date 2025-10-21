'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Station } from '@/types/station';
import StationCommonSection from './StationCommonSection';
import StationImagesSection from './StationImagesSection';
import StationContactSection from './StationContactSection';
import StationAddressSection from './StationAddressSection';
import StationDirectionsSection from './StationDirectionsSection';
import {CategorizedImage} from "@/types/image";

interface StationEditFormProps {
  initialData: Partial<Station>;
  images?: CategorizedImage[]
  onSubmit: (formData: Partial<Station>) => Promise<{ success: boolean; error?: string }>;
}

export default function StationEditForm({ initialData, images, onSubmit }: StationEditFormProps) {
  const t = useTranslations('import');
  const locale = useLocale();
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [stationImages, setStationImages] = useState<CategorizedImage[]>(images || []);

  useEffect(() => {
    setStationImages(images || []);
  }, [images]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const { checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageToggle = async (imageId: number, isActive: boolean) => {
    try {
      const response = await fetch(`/${locale}/api/images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: isActive }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update image status.');
      }

      await response.json();
      setStationImages((prevImages) =>
        prevImages.map((img) => (img.id === imageId ? { ...img, active: isActive } : img))
      );
      setFeedback({ type: 'success', message: 'Image status updated successfully!' });
    } catch (error) {
      console.error('Error toggling image active status:', error);
      setFeedback({ type: 'error', message: (error as Error).message || 'Failed to update image status.' });
    }
  };

  const handleImageMetadataChange = async (imageId: number, field: string, value: string) => {
    try {
      const response = await fetch(`/${locale}/api/images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update image metadata.');
      }

      await response.json();
      setStationImages((prevImages) =>
        prevImages.map((img) => (img.id === imageId ? { ...img, [field]: value } : img))
      );
      setFeedback({ type: 'success', message: 'Image metadata updated successfully!' });
    } catch (error) {
      console.error('Error updating image metadata:', error);
      setFeedback({ type: 'error', message: (error as Error).message || 'Failed to update image metadata.' });
    }
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

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <StationCommonSection formData={formData} initialData={initialData} handleFormChange={handleFormChange} />
      <StationImagesSection images={stationImages} handleFormChange={handleFormChange} handleImageToggle={handleImageToggle} handleImageMetadataChange={handleImageMetadataChange} />
      <StationContactSection formData={formData} initialData={initialData} handleFormChange={handleFormChange} />
      <StationAddressSection formData={formData} initialData={initialData} handleFormChange={handleFormChange} />
      <StationDirectionsSection formData={formData} initialData={initialData} handleFormChange={handleFormChange} />

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : t('save_button')}
        </button>
      </div>
      {feedback.message && (
        <div className={`text-sm text-center mt-4 ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback.message}
        </div>
      )}
    </form>
  );
}
