'use client';

import { useTranslations } from 'next-intl';
import { Station } from '@/types/station';
import Image from 'next/image';
import InputField from '@/components/inputs/InputField';

interface StationContactSectionProps {
  formData: Partial<Station>;
  initialData: Partial<Station>;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function StationContactSection({ formData, initialData, handleFormChange }: StationContactSectionProps) {
  const t = useTranslations('import');

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-[64px] rounded-[32px] flex flex-col gap-4">
      <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative shrink-0 w-full">
        <div className="relative shrink-0 size-[32px]">
          <Image alt="Incoming call icon" className="block max-w-none size-full" src="/assets/svg/uil-incoming-call.svg" width={32} height={32} />
        </div>
        <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[24px] text-black tracking-[-0.1px]">
          {t('contact_section_title')}
        </p>
      </div>
      <div className="content-start flex flex-wrap gap-4 items-start relative shrink-0 w-full">
        <InputField label={t('phone_number')} id="phone_number" name="phone_number" value={formData.phone_number as string || ''} onChange={handleFormChange} initialValue={initialData.phone_number as string || ''} />
        <InputField label={t('hotline_number')} id="hotline_number" name="hotline_number" value={formData.hotline_number as string || ''} onChange={handleFormChange} initialValue={initialData.hotline_number as string || ''} />
        <InputField label={t('fax_number')} id="fax_number" name="fax_number" value={formData.fax_number as string || ''} onChange={handleFormChange} initialValue={initialData.fax_number as string || ''} />
        <InputField label={t('email')} id="email" name="email" type="email" value={formData.email as string || ''} onChange={handleFormChange} initialValue={initialData.email as string || ''} />
      </div>
    </div>
  );
}
