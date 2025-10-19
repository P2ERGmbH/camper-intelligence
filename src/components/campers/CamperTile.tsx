import React from 'react';
import Image from 'next/image';
import {CamperWIthTileImage} from '@/types/camper';
import {CategorizedImage} from "@/types/image";


interface CamperTileProps {
  camper: CamperWIthTileImage;
  children: React.ReactNode;
  images?: CategorizedImage[]
}

export default function CamperTile({ camper, images, children }: CamperTileProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const image =  camper.tileImage || images?.find((img)=> { return img.category === 'mood'} ) || images?.find((img)=> { return img.category === 'exterior'} ) || images?.find((img)=> { return true} )
  return (
    <div className="border border-neutral-200 dark:border-gray-700 border-solid relative rounded-[16px] shrink-0 w-full bg-white dark:bg-gray-800 p-4">
      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
        <Image
          src={image?.url || '/assets/img/camper-placeholder.png'}
          alt={image?.alt_text || camper?.name || 'Camper Image'}
          fill
          className={'object-cover'}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{camper.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{camper.description}</p>
      {children}
    </div>
  );
}