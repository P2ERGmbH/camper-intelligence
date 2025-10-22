'use client';

import React, {useState, useTransition} from 'react';

import {Camper} from '@/types/camper';
import {StationWithImageTile} from '@/types/station';
import {Image as ImageType, CategorizedImage} from '@/types/image';
import {CamperOverview} from './CamperOverview';
import {CamperProperties} from './CamperProperties';

import ImageGallery from "@/components/images/ImageGallery";
import CamperStationAssignment from "@/components/camper/CamperStationAssignment";
import {useLocale} from "next-intl";
import ImageEdit from "@/components/images/ImageEdit";


interface CamperDetailsClientProps {
    initialCamper: Camper;
    providerStations: StationWithImageTile[];
    providerLogo?: ImageType | null;
    camperImages: CategorizedImage[];
    slug: string;
}

export default function CamperDetailsClient({
                                                initialCamper,
                                                providerStations,
                                                providerLogo,
                                                camperImages,
                                                slug,
                                            }: CamperDetailsClientProps) {
    const locale = useLocale();
    const [camper] = useState(initialCamper);
    const [images, setImages] = useState(camperImages);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isPending, startTransition] = useTransition();

    const handleImageUpdate = (updatedImage: ImageType) => {
        setImages(prevImages =>
            prevImages.map(img => (img.id === updatedImage.id ? updatedImage : img))
        );
    };

    const handleImageSave = async (image: Partial<CategorizedImage>) => {
        try {
            const res = await fetch(`/${locale}/api/images/${image.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({image, camperId: camper.id}),
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
                setImages(prevImages => prevImages.filter(img => img.id !== imageId));
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


    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
            <main className="flex-grow container mx-auto px-6 py-12 max-w-[1328px] space-y-6">
                <ImageGallery
                    images={images}
                    onImageSave={handleImageSave}
                    onImageUpdate={handleImageUpdate}
                    onImageDelete={handleImageDelete}
                />
                <CamperOverview camper={camper} providerLogo={providerLogo}/>
                <div
                    className="bg-white border border-[#d6dfe5] border-solid box-border content-stretch flex flex-col lg:flex-row items-start justify-between px-4 py-6 lg:px-[40px] lg:py-[32px] relative rounded-[16px] shrink-0 w-full">
                    <ImageEdit
                        images={images}
                        onImageSave={handleImageSave}
                        onImageUpdate={handleImageUpdate}
                        onImageDelete={handleImageDelete}
                        categories={[
                            {label: "Mood", value: "mood"},
                            {label: "Exterieur", value: "exterior"},
                            {label: "Interieur", value: "interior"},
                            {label: "Misc", value: "misc"},
                            {label: "Aussen", value: "outside"},
                            {label: "Floorplan", value: "floorplan"},
                            {label: "Andres", value: "other"}
                        ]}
                    />
                </div>
                <CamperProperties camper={camper}/>
                <CamperStationAssignment camper={camper} providerStations={providerStations} slug={slug}/>
            </main>
        </div>
    );
}
