'use client';

import { useTranslations } from 'next-intl';
import { Station } from '@/types/station';
import Image from 'next/image';
import InputField from './InputField';

interface StationDirectionsSectionProps {
  formData: Partial<Station>;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function StationDirectionsSection({ formData, handleFormChange }: StationDirectionsSectionProps) {
  const t = useTranslations('import');

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-[64px] rounded-[32px] flex flex-col gap-4">
      <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative shrink-0 w-full">
        <div className="relative shrink-0 size-[32px]">
          <Image alt="Compass icon" className="block max-w-none size-full" src="/assets/svg/uil-compass.svg" width={32} height={32} />
        </div>
        <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[24px] text-black tracking-[-0.1px]">
          {t('directions_section_title')}
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full">
        <div className="content-start flex flex-wrap gap-4 items-start relative shrink-0 w-full">
          <InputField label={t('distance_motorway_km')} id="distance_motorway_km" name="distance_motorway_km" type="number" value={formData.distance_motorway_km as number || 0} onChange={handleFormChange} />
          <InputField label={t('distance_airport_km')} id="distance_airport_km" name="distance_airport_km" type="number" value={formData.distance_airport_km as number || 0} onChange={handleFormChange} />
          <InputField label={t('distance_train_station_km')} id="distance_train_station_km" name="distance_train_station_km" type="number" value={formData.distance_train_station_km as number || 0} onChange={handleFormChange} />
          <InputField label={t('distance_bus_stop_km')} id="distance_bus_stop_km" name="distance_bus_stop_km" type="number" value={formData.distance_bus_stop_km as number || 0} onChange={handleFormChange} />
        </div>
        <InputField label={t('description')} id="directions_description" name="directions_description" value={formData.directions_description as string || ''} onChange={handleFormChange} type="textarea" rows={4} />
      </div>
    </div>
  );
}
