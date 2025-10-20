'use client';

import { useTranslations } from 'next-intl';
import { Station } from '@/types/station';
import Image from 'next/image';
import InputField from './InputField';
import ToggleInput from './ToggleInput';

interface StationCommonSectionProps {
  formData: Partial<Station>;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function StationCommonSection({ formData, handleFormChange }: StationCommonSectionProps) {
  const t = useTranslations('import');

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-[64px] rounded-[32px] flex flex-col gap-4">
      <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative shrink-0 w-full">
          <div className="relative shrink-0 size-[32px]">
            <Image alt="Settings icon" className="block max-w-none size-full" src="/assets/svg/uil-setting.svg" width={32} height={32} />
          </div>
          <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[24px] text-black tracking-[-0.1px]">
            {t('common_section_title')}
          </p>
        </div>
        <div className="content-start flex flex-wrap gap-4 items-start relative shrink-0 w-full">
          <InputField label={t('name')} id="name" name="name" value={formData.name as string || ''} onChange={handleFormChange} />
          <InputField label={t('ext_id')} id="ext_id" name="ext_id" value={formData.ext_id as string || ''} onChange={handleFormChange} />
          <InputField label={t('rental_company_id')} id="rental_company_id" name="rental_company_id" value={formData.rental_company_id as string || ''} onChange={handleFormChange} />
          <InputField label={t('iata')} id="iata" name="iata" value={formData.iata as string || ''} onChange={handleFormChange} />
          <InputField label={t('vehiclecount')} id="vehiclecount" name="vehiclecount" type="number" value={formData.vehiclecount as number || 0} onChange={handleFormChange} />
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-4 items-start relative shrink-0 w-full">
        <ToggleInput
          label={t('fuel_station_info')}
          checkboxId="fuel_station_info_available"
          checkboxName="fuel_station_info_available"
          checkboxChecked={formData.fuel_station_info_available as boolean || false}
          onCheckboxChange={handleFormChange}
          inputId="fuel_station_info"
          inputName="fuel_station_info"
          inputValue={formData.fuel_station_info as string || ''}
          onInputChange={handleFormChange}
          inputPlaceholder={t('info_optional')}
        />
        <ToggleInput
          label={t('parking_info')}
          checkboxId="parking_info_available"
          checkboxName="parking_info_available"
          checkboxChecked={formData.parking_info_available as boolean || false}
          onCheckboxChange={handleFormChange}
          inputId="parking_info"
          inputName="parking_info"
          inputValue={formData.parking_info as string || ''}
          onInputChange={handleFormChange}
          inputPlaceholder={t('info_optional')}
        />
        <ToggleInput
          label={t('greywater_disposal_info')}
          checkboxId="greywater_disposal_info_available"
          checkboxName="greywater_disposal_info_available"
          checkboxChecked={formData.greywater_disposal_info_available as boolean || false}
          onCheckboxChange={handleFormChange}
          inputId="greywater_disposal_info"
          inputName="greywater_disposal_info"
          inputValue={formData.greywater_disposal_info as string || ''}
          onInputChange={handleFormChange}
          inputPlaceholder={t('info_optional')}
        />
        <ToggleInput
          label={t('lounge_area')}
          checkboxId="lounge_area"
          checkboxName="lounge_area"
          checkboxChecked={formData.lounge_area as boolean || false}
          onCheckboxChange={handleFormChange}
          inputId="lounge_area_info"
          inputName="lounge_area_info"
          inputValue={formData.lounge_area_info as string || ''}
          onInputChange={handleFormChange}
          inputPlaceholder={t('info_optional')}
        />
        <ToggleInput
          label={t('guest_toilet')}
          checkboxId="guest_toilet"
          checkboxName="guest_toilet"
          checkboxChecked={formData.guest_toilet as boolean || false}
          onCheckboxChange={handleFormChange}
          inputId="guest_toilet_info"
          inputName="guest_toilet_info"
          inputValue={formData.guest_toilet_info as string || ''}
          onInputChange={handleFormChange}
          inputPlaceholder={t('info_optional')}
        />
        <ToggleInput
          label={t('shopping_info')}
          checkboxId="shopping_info_available"
          checkboxName="shopping_info_available"
          checkboxChecked={formData.shopping_info_available as boolean || false}
          onCheckboxChange={handleFormChange}
          inputId="shopping_info"
          inputName="shopping_info"
          inputValue={formData.shopping_info as string || ''}
          onInputChange={handleFormChange}
          inputPlaceholder={t('info_optional')}
        />
      </div>
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
        <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14px] text-black">
          {t('payment_options')}
        </p>
        <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
          <div className="bg-[#def6e7] border border-[#3d8362] border-solid box-border content-stretch flex gap-[10px] items-center px-[16px] py-[12px] relative rounded-[84px] shrink-0">
            <div className="h-[20px] relative shrink-0 w-[16.954px]">
              <Image alt="Paypal logo" className="block max-w-none size-full" src="/assets/svg/logos-paypal.svg" width={16.954} height={20} />
            </div>
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#2a6047] text-[14px]">
              Paypal
            </p>
          </div>
          <div className="bg-[#def6e7] border border-[#3d8362] border-solid box-border content-stretch flex gap-[10px] h-[44px] items-center px-[16px] py-[12px] relative rounded-[84px] shrink-0">
            <div className="h-[16px] relative shrink-0 w-[49.349px]">
              <Image alt="Visa logo" className="block max-w-none size-full" src="/assets/svg/logos-visa.svg" width={49.349} height={16} />
            </div>
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#2a6047] text-[14px]">
              Visa
            </p>
          </div>
          <div className="border border-[#ccced7] border-solid box-border content-stretch flex gap-[10px] items-center px-[16px] py-[12px] relative rounded-[84px] shrink-0">
            <div className="h-[20px] relative shrink-0 w-[25.729px]">
              <Image alt="Mastercard logo" className="block max-w-none size-full" src="/assets/svg/logos-mastercard.svg" width={25.729} height={20} />
            </div>
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] relative shrink-0 text-[14px] text-black">
              Mastercard
            </p>
          </div>
          <div className="border border-[#ccced7] border-solid box-border content-stretch flex gap-[10px] items-center px-[16px] py-[12px] relative rounded-[84px] shrink-0">
            <div className="h-[20px] relative shrink-0 w-[25.729px]">
              <Image alt="Maestro logo" className="block max-w-none size-full" src="/assets/svg/logos-maestro.svg" width={25.729} height={20} />
            </div>
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] relative shrink-0 text-[14px] text-black">
              Maestro
            </p>
          </div>
          <div className="border border-[#ccced7] border-solid box-border content-stretch flex gap-[10px] items-center px-[16px] py-[12px] relative rounded-[84px] shrink-0">
            <div className="h-[20px] relative shrink-0 w-[35.955px]">
              <Image alt="Klarna logo" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src="/assets/img/image5.png" width={35.955} height={20} />
            </div>
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] relative shrink-0 text-[14px] text-black">
              Klarna
            </p>
          </div>
          <div className="border border-[#ccced7] border-solid box-border content-stretch flex gap-[10px] h-[44px] items-center px-[16px] py-[12px] relative rounded-[84px] shrink-0">
            <div className="h-[18px] relative shrink-0 w-[43.678px]">
              <Image alt="Apple Pay logo" className="block max-w-none size-full" src="/assets/svg/logos-apple-pay.svg" width={43.678} height={18} />
            </div>
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] relative shrink-0 text-[14px] text-black">
              Apple Pay
            </p>
          </div>
          <div className="border border-[#ccced7] border-solid box-border content-stretch flex gap-[10px] items-center px-[16px] py-[12px] relative rounded-[84px] shrink-0">
            <div className="h-[20px] relative shrink-0 w-[50.196px]">
              <Image alt="Google Pay logo" className="block max-w-none size-full" src="/assets/svg/logos-google-pay.svg" width={50.196} height={20} />
            </div>
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] relative shrink-0 text-[14px] text-black">
              Google Pay
            </p>
          </div>
          <div className="bg-[#f7f7f7] border border-[#ccced7] border-solid box-border content-stretch flex gap-[10px] items-center px-[16px] py-[12px] relative rounded-[84px] shrink-0">
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal h-[20px] leading-[1.3] relative shrink-0 text-[14px] text-black w-[76px] whitespace-pre-wrap">
              {t('add')}
            </p>
            <div className="relative shrink-0 size-[20px]">
              <Image alt="Plus icon" className="block max-w-none size-full" src="/assets/svg/uil-plus.svg" width={20} height={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
