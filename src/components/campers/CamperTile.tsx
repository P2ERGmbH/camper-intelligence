'use client';

import React, { useTransition } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Camper } from '@/types/camper';
import { useTranslations } from 'next-intl';
import { handleCamperMappingAction } from '@/app/[locale]/provider/[slug]/stations/actions';

interface CamperTileProps {
  camper: Camper;
  slug: string;
  isMapped: boolean;
  currentStationId: string;
}

export default function CamperTile({ camper, slug, isMapped, currentStationId }: CamperTileProps) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('dashboard');

  const handleToggle = () => {
    startTransition(async () => {
      const newStationId = isMapped ? null : parseInt(currentStationId);
      await handleCamperMappingAction(camper.id, newStationId, slug, currentStationId);
    });
  };

  return (
    <div className="border border-neutral-200 dark:border-gray-700 border-solid relative rounded-[16px] shrink-0 w-full bg-white dark:bg-gray-800 p-4">
      <Link href={{ pathname: '/provider/[slug]/campers/[id]/edit', params: { slug, id: camper.id } }}>
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={camper.imageUrl || '/assets/img/camper-placeholder.png'}
            alt={camper.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{camper.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{camper.description}</p>
      </Link>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`w-full py-2 px-4 rounded-lg font-bold transition-colors duration-200
          ${isMapped
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
          }
          ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isPending
          ? 'Updating...'
          : isMapped
            ? t('unmap_camper_button')
            : t('map_camper_button')}
      </button>
    </div>
  );
}