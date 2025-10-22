'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Station } from '@/types/station';
import StationCommonSection from './StationCommonSection';
import ImageEdit from '@/components/images/ImageEdit';
import StationContactSection from './StationContactSection';
import StationAddressSection from './StationAddressSection';
import StationDirectionsSection from './StationDirectionsSection';
import {CategorizedImage, Image as ImageType} from "@/types/image";

interface StationEditFormProps {
  station: Partial<Station>;
  images?: CategorizedImage[]
  onSubmit: (formData: Partial<Station>) => Promise<{ success: boolean; error?: string }>;
}

export default function StationEditForm({ station, images, onSubmit }: StationEditFormProps) {
  const t = useTranslations('import');
  const locale = useLocale();
  const [formData, setFormData] = useState(station);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [stationImages, setStationImages] = useState<CategorizedImage[]>(images || []);

  useEffect(() => {
    setStationImages(images || []);
  }, [images]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const { checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageSave = async (image: Partial<CategorizedImage>) => {
    try {
      const res = await fetch(`/${locale}/api/images/${image.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({image, stationId: station.id}),
      });

      if (res.ok) {
        return await res.json();
      } else {
        const data = await res.json();
        console.error('Failed to update image metadata:', data.error);
        return data;
      }
    } catch (error) {
      console.error('An unexpected error occurred while saving image metadata:', error);
      return null;
    }
  };

  const handleImageDelete = async (imageId: number) => {
    try {
      const res = await fetch(`/${locale}/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStationImages(prevImages => prevImages.filter(img => img.id !== imageId));
        return true;
      } else {
        const data = await res.json();
        console.error('Failed to delete image:', data.error);
        return false;
      }
    } catch (error) {
      console.error('An unexpected error occurred while deleting image:', error);
      return false;
    }
  }

  const handleImageUpdate = (updatedImage: CategorizedImage) => {
    setStationImages(prevImages =>
        prevImages.map(img => (img.id === updatedImage.id ? updatedImage : img))
    );
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
      <StationCommonSection formData={formData} initialData={station} handleFormChange={handleFormChange} />
      <ImageEdit images={stationImages} onImageDelete={handleImageDelete} onImageSave={handleImageSave} onImageUpdate={handleImageUpdate} categories={[{label: "Haupt", value: "main"}, {
        label: "Logo",
        value: "logo"
      }, {label: "Innen", value: "inside"}, {
        label: "Aussen",
        value: "outside"
      }, {label: "Andres", value: "other"}]}/>
      <StationContactSection formData={formData} initialData={station} handleFormChange={handleFormChange} />
      <StationAddressSection formData={formData} initialData={station} handleFormChange={handleFormChange} />
      <StationDirectionsSection formData={formData} initialData={station} handleFormChange={handleFormChange} />

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
