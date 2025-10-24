'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CategorizedImage } from '@/types/image';
import { useRouter } from 'next/navigation';

interface ImageGalleryProps {
  images: CategorizedImage[];
  onImageSave: (image: Partial<CategorizedImage>) => Promise<CategorizedImage>;
  onImageUpdate: (updatedImage: CategorizedImage) => void;
  onImageDelete: (imageId: number) => Promise<boolean>;
}

export default function ImageGallery({
  images,
  onImageSave,
  onImageUpdate,
  onImageDelete,
}: ImageGalleryProps) {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const [expandedImage, setExpandedImage] = useState<CategorizedImage | null>(null);
  const [editData, setEditData] = useState<Partial<CategorizedImage>>({});
  const [isSaving, startSavingTransition] = useTransition();
  const [isDeleting, startDeletingTransition] = useTransition();

  const handleExpand = (image: CategorizedImage) => {
    setExpandedImage(image);
    setEditData({ ...image });
  };

  const handleClose = () => {
    setExpandedImage(null);
    setEditData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!expandedImage) return;

    startSavingTransition(async () => {
      const response = await onImageSave(editData);
      if (response?.id) {
        onImageUpdate(response);
        handleClose();
          router.refresh(); // Refresh the page to show updated images
      }
    });
  };

  const handleDelete = async () => {
    if (!expandedImage) return;

    if (!confirm(t('confirm_delete_image'))) {
      return;
    }

    startDeletingTransition(async () => {
      const response = await onImageDelete(expandedImage.id);
      if (response) {
        handleClose();
        router.refresh(); // Refresh the page to show updated images
      }
    });
  };

  const categories = ['mood', 'exterior', 'interior', 'floorplan', 'misc'];
 // Example categories

  return (
      <div className="content-stretch flex gap-1 h-[393px] items-start relative shrink-0 w-full overflow-x-auto snap-x snap-mandatory rounded-lg overflow-hidden" data-name="images"
           data-node-id="171:296">
        {images.map((camperImage, index) => {
          if (!camperImage.width) {
            return null;
          }
          return (
              <div className="h-[393px] relative rounded-[8px] shrink-0 w-[589px] snap-center" data-name="aussenansicht-seite 1"
                   data-node-id="171:277" key={`${camperImage.id}-${index}`}>
                <Image alt="Aussenansicht Seite 1"
                       className="rounded-[8px] size-full cursor-pointer"
                       onClick={() => handleExpand(camperImage)}
                       src={camperImage.url} width={camperImage.width} height={camperImage.height} aria-label={camperImage.alt_text || camperImage.caption || 'Camper Image'} />
              </div>
          );
        })}
        {expandedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
              <div
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
                <button onClick={handleClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold">
                  &times;
                </button>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('edit_image_metadata')}</h3>
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                      src={expandedImage.url}
                      alt={expandedImage.alt_text || expandedImage.caption || 'Camper Image'}
                      fill
                      style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('caption')}</label>
                    <input type="text" id="caption" name="caption" value={editData.caption || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="alt_text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('alt_text')}</label>
                    <input type="text" id="alt_text" name="alt_text" value={editData.alt_text || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="copyright_holder_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('copyright_holder_name')}</label>
                    <input type="text" id="copyright_holder_name" name="copyright_holder_name" value={editData.copyright_holder_name || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('category')}</label>
                    <select id="category" name="category" value={editData.category || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">{t('select_category')}</option>
                      {categories.map(cat => <option key={cat} value={cat}>{t(cat)}</option>)}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
                    >
                      {isDeleting ? t('deleting') : t('delete_image')}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
                    >
                      {isSaving ? t('saving') : t('save')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
