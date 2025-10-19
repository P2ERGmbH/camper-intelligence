'use client';

import React, { useState, useTransition } from 'react';

import { Camper } from '@/types/camper';
import { StationWithImageTile } from '@/types/station';
import {Image as ImageType, ImageCamperImage} from '@/types/image';
import { CamperOverview } from './CamperOverview';
import { CamperProperties } from './CamperProperties';

import CamperImageGallery from "@/components/camper/CamperImageGallery";
import CamperStationAssignment from "@/components/camper/CamperStationAssignment";


interface CamperDetailsClientProps {
  initialCamper: Camper;
  providerStations: StationWithImageTile[];
  providerLogo?: ImageType|null;
  camperImages: ImageCamperImage[];
  slug: string;
}

export default function CamperDetailsClient({
  initialCamper,
  providerStations,
  providerLogo,
  camperImages,
  slug,
}: CamperDetailsClientProps) {

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
      <main className="flex-grow container mx-auto px-6 py-12 max-w-[1328px] space-y-6">
        <CamperImageGallery
            images={images}
            camperId={camper.id}
            onImageUpdate={handleImageUpdate}
            onImageDelete={handleImageDelete}
        />
        <CamperOverview camper={camper} providerLogo={providerLogo}/>
        <CamperProperties camper={camper} />
        <CamperStationAssignment camper={camper} providerStations={providerStations} slug={slug}/>
      </main>
    </div>
  );
}
