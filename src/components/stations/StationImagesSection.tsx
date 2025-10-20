'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import InputField from './InputField';
import { CategorizedImage } from '@/types/image';

interface StationImagesSectionProps {
  images: CategorizedImage[];
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function StationImagesSection({ images, handleFormChange }: StationImagesSectionProps) {
  const t = useTranslations('import');
  const [activeImage, setActiveImage] = useState<CategorizedImage | null>(null);

  useEffect(() => {
    if (images && images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [images]);

  const handleImageSelect = (image: CategorizedImage) => {
    setActiveImage(image);
  };

  const renderImage = (image: CategorizedImage) => {
    const isActive = activeImage?.id === image.id;
    return (
      <div
        key={image.id}
        className={`box-border content-stretch flex flex-[1_0_0] gap-[8px] h-[241px] items-start justify-end p-[12px] relative rounded-[12px] shrink-0 w-full sm:w-[calc(50%-6px)] lg:w-[238px] cursor-pointer ${isActive ? 'border-2 border-indigo-500' : ''}`}
        onClick={() => handleImageSelect(image)}
      >
        <Image alt={image.alt_text || 'Station image'} className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[12px] size-full" src={image.url} width={238} height={241} />
        <div className="relative shrink-0 size-[34px]" data-name="uil:pen" data-node-id="566:463">
          <Image alt="Edit icon" className="block max-w-none size-full" src="/assets/svg/uil-pen.svg" width={34} height={34} />
        </div>
        <div className="bg-white box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[11px] relative rounded-[40px] shrink-0 size-[34px]" data-name="uil:trash-alt" data-node-id="566:465">
          <Image alt="Redo icon" className="block max-w-none size-full" src="/assets/svg/uil-redo.svg" width={16} height={16} />
        </div>
        <div className="relative shrink-0 size-[34px]" data-name="uil:trash-alt" data-node-id="566:469">
          <Image alt="Trash icon" className="block max-w-none size-full" src="/assets/svg/uil-trash-alt.svg" width={34} height={34} />
        </div>
        {isActive && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full h-8 w-8 flex items-center justify-center shadow-md">
            <div className="bg-indigo-600 rounded-full h-4 w-4"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-[64px] rounded-[32px] flex flex-col gap-4">
      <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative shrink-0 w-full">
        <div className="relative shrink-0 size-[32px]">
          <Image alt="Camera icon" className="block max-w-none size-full" src="/assets/svg/uil-camera.svg" width={32} height={32} />
        </div>
        <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[24px] text-black tracking-[-0.1px]">
          {t('images_section_title')}
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
        <div className="content-stretch flex gap-3 sm:gap-[12px] items-start relative shrink-0 w-full flex-wrap">
          {images.map(renderImage)}
          <div className="border border-[#626680] border-dashed box-border content-stretch flex flex-[1_0_0] h-[241px] items-center justify-between min-h-px min-w-px px-[16px] py-[52px] relative rounded-[12px] shrink-0 w-full sm:w-[calc(50%-6px)] lg:w-[238px]">
            <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0">
              <div className="relative shrink-0 size-[48px]">
                <Image alt="Cloud upload icon" className="block max-w-none size-full" src="/assets/svg/uil-cloud-upload.svg" width={48} height={48} />
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0">
                <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[18px] text-black">
                  Drag and drop
                </p>
                <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] relative shrink-0 text-[#8c8f95] text-[14px]">
                  {t('or')}
                </p>
                <div className="bg-black box-border content-stretch flex gap-[8px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0 w-full">
                  <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[14px] text-white">
                    {t('upload_image')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[40px] items-start justify-center relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex gap-4 items-start relative shrink-0 w-full">
              <InputField label={t('category')} id="image_category" name="image_category" value={activeImage?.category || ''} onChange={handleFormChange} />
              <InputField label={t('author')} id="image_author" name="image_author" value={activeImage?.author || ''} onChange={handleFormChange} />
            </div>
            <InputField label={t('copyright')} id="image_copyright" name="image_copyright" value={activeImage?.copyright || ''} onChange={handleFormChange} />
            <InputField label={t('alt_text')} id="image_alt_text" name="image_alt_text" value={activeImage?.alt_text || ''} onChange={handleFormChange} />
            <InputField label={t('description')} id="image_description" name="image_description" value={activeImage?.description || ''} onChange={handleFormChange} type="textarea" rows={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
