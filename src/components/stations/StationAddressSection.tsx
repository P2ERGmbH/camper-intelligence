'use client';

import { useTranslations } from 'next-intl';
import { Station } from '@/types/station';
import Image from 'next/image';
import InputField from './InputField';

interface StationAddressSectionProps {
  formData: Partial<Station>;
  initialData: Partial<Station>;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function StationAddressSection({ formData, initialData, handleFormChange }: StationAddressSectionProps) {
  const t = useTranslations('import');

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-[64px] rounded-[32px] flex flex-col gap-4">
      <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative shrink-0 w-full">
        <div className="relative shrink-0 size-[32px]">
          <Image alt="House user icon" className="block max-w-none size-full" src="/assets/svg/uil-house-user.svg" width={32} height={32} />
        </div>
        <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[24px] text-black tracking-[-0.1px]">
          {t('address_section_title')}
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full">
        <div className="content-start flex flex-wrap gap-4 items-start relative shrink-0 w-full">
          <InputField label={t('country')} id="country" name="country" value={formData.country as string || ''} onChange={handleFormChange} initialValue={initialData.country as string || ''} />
          <InputField label={t('country_code')} id="country_code" name="country_code" value={formData.country_code as string || ''} onChange={handleFormChange} initialValue={initialData.country_code as string || ''} />
          <InputField label={t('city')} id="city" name="city" value={formData.city as string || ''} onChange={handleFormChange} initialValue={initialData.city as string || ''} />
          <InputField label={t('postal_code')} id="postal_code" name="postal_code" value={formData.postal_code as string || ''} onChange={handleFormChange} initialValue={initialData.postal_code as string || ''} />
          <InputField label={t('street')} id="street" name="street" value={formData.street as string || ''} onChange={handleFormChange} initialValue={initialData.street as string || ''} />
          <InputField label={t('street_number')} id="street_number" name="street_number" value={formData.street_number as string || ''} onChange={handleFormChange} initialValue={initialData.street_number as string || ''} />
          <InputField label={t('administrative_area_level_1')} id="administrative_area_level_1" name="administrative_area_level_1" value={formData.administrative_area_level_1 as string || ''} onChange={handleFormChange} initialValue={initialData.administrative_area_level_1 as string || ''} />
          <InputField label={t('administrative_area_level_2')} id="administrative_area_level_2" name="administrative_area_level_2" value={formData.administrative_area_level_2 as string || ''} onChange={handleFormChange} initialValue={initialData.administrative_area_level_2 as string || ''} />
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0">
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
            <label htmlFor="address_map_location" className="block text-sm font-medium text-gray-700">
              {t('maps_location')}
            </label>
            <div className="h-auto relative rounded-[12px] shrink-0 w-full">
              <Image alt="Map location" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src="/assets/img/image3.png" width={990} height={495} />
            </div>
          </div>
          <div className="content-stretch flex flex-col sm:flex-row gap-4 sm:gap-[16px] items-start sm:items-center relative shrink-0 w-full">
            <InputField label={t('lon_coordinate')} id="lng" name="lng" type="number" value={formData.lng as number || 0} onChange={handleFormChange} initialValue={initialData.lng as number || 0} />
            <InputField label={t('lat_coordinate')} id="lat" name="lat" type="number" value={formData.lat as number || 0} onChange={handleFormChange} initialValue={initialData.lat as number || 0} />
          </div>
        </div>
        <InputField label={t('address_description')} id="address_description" name="address_description" value={formData.address_description as string || ''} onChange={handleFormChange} type="textarea" rows={4} initialValue={initialData.address_description as string || ''} />
      </div>
    </div>
  );
}
