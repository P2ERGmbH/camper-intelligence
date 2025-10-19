'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { CamperWIthTileImage } from '@/types/camper';
import { useTranslations } from 'next-intl';
import { Image as ImageType } from '@/types/image';


interface ProviderCamperTileProps {
  camper: CamperWIthTileImage;
  tileImage?: ImageType | null;
  slug: string;
  onToggleActive: (camperId: number, isActive: boolean) => void;
  isPending: boolean;
}

export default function ProviderCamperTile({ camper, slug, onToggleActive, isPending }: ProviderCamperTileProps) {
  const t = useTranslations('dashboard');
  const handleToggle = () => {
    onToggleActive(camper.id, !camper.active);
  };

  return (
    <div className="border border-neutral-200 dark:border-gray-700 border-solid relative rounded-[16px] shrink-0 w-full bg-white dark:bg-gray-800 p-4">
      <Link href={{ pathname: '/provider/[slug]/campers/[camperId]', params: { slug, camperId: camper.id } }}>
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={camper?.tileImage?.url || '/assets/img/camper-placeholder.png'}
            alt={camper?.tileImage?.alt_text ||camper.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{camper.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{camper.description}</p>
      </Link>
      <div className="flex items-center justify-between mt-4">
        <label htmlFor={`toggle-active-${camper.id}`} className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              id={`toggle-active-${camper.id}`}
              className="sr-only"
              checked={camper.active || false}
              onChange={handleToggle}
              disabled={isPending}
            />
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
          </div>
          <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
            {camper.active ? t('active') : t('inactive')}
          </div>
        </label>
        <Link href={{ pathname: '/provider/[slug]/campers/[camperId]/edit', params: { slug, camperId: camper.id } }} className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
          {t('edit_camper')}
        </Link>
      </div>
    </div>
  );
}
