'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Camper } from '@/types/camper';
import { Station } from '@/types/station';
import { Image as ImageType } from '@/types/image';
import CamperTile from '@/components/campers/CamperTile';
import { Link } from '@/i18n/routing';
import ImageUploader from '@/components/images/ImageUploader';
import CamperImageGallery from '@/components/camper/CamperImageGallery';
import CamperStationAssignment from '@/components/camper/CamperStationAssignment';


interface CamperDetailsClientProps {
  initialCamper: Camper;
  allStations: Station[];
  camperImages: ImageType[];
  slug: string;
}

export default function CamperDetailsClient({
  initialCamper,
  allStations,
  camperImages,
  slug,
}: CamperDetailsClientProps) {
  const t = useTranslations('dashboard');
  const [camper] = useState(initialCamper);
  const [images, setImages] = useState(camperImages);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  const handleImageUpdate = (updatedImage: ImageType) => {
    setImages(prevImages =>
      prevImages.map(img => (img.id === updatedImage.id ? updatedImage : img))
    );
  };

  const handleImageDelete = (imageId: number) => {
    setImages(prevImages => prevImages.filter(img => img.id !== imageId));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('camper_details_title', { camperName: camper.name })}</h1>

          {/* Camper Tile at the top */}
          <div className="mb-12">
            <CamperTile camper={camper} images={camperImages}>
              <Link href={{ pathname: '/provider/[slug]/campers/[id]/edit', params: { slug, id: camper.id } }} className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                {t('view_details_button')}
              </Link>
            </CamperTile>
          </div>

          {/* Media Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t('media_section_title')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CamperImageGallery
                  images={images}
                  camperId={camper.id}
                  onImageUpdate={handleImageUpdate}
                  onImageDelete={handleImageDelete}
                />
              </div>
              <div>
                <ImageUploader parentId={camper.id} parentType="camper" />
              </div>
            </div>
          </section>

          {/* Station Assignment Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('station_assignment_title')}</h2>
            <CamperStationAssignment
              camper={camper}
              allStations={allStations}
              slug={slug}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
