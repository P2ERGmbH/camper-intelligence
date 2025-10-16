import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface MinimalStationTileProps {
  stationId: number;
  name: string;
  countryFlag: string;
  addressLine1: string;
  addressLine2: string;
  imageUrl: string;
  onEdit: (stationId: number) => void;
}

export default function MinimalStationTile({
  stationId,
  name,
  countryFlag,
  addressLine1,
  addressLine2,
  imageUrl,
  onEdit,
}: MinimalStationTileProps) {
  const t = useTranslations('Stations');

  return (
    <div className="border border-neutral-200 border-solid relative rounded-[16px] shrink-0 w-[362px]">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-[362px]">
        <div className="aspect-[640/320] relative shrink-0 w-full">
          <Image
            alt={`${name} station image`}
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={imageUrl}
            width={640}
            height={320}
          />
        </div>
        <div className="bg-white box-border content-stretch flex flex-col gap-[36px] items-start pb-[24px] pt-[20px] px-[24px] relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold items-start justify-between leading-[1.2] relative shrink-0 text-[#212229] text-[24px] tracking-[-0.1px] w-full">
                <p className="relative shrink-0">
                  {name}
                </p>
                <p className="relative shrink-0">
                  {countryFlag}
                </p>
              </div>
              <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#4d616e] text-[14px] w-full whitespace-pre-wrap">
                <p className="mb-0">{addressLine1}</p>
                <p>{addressLine2}</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <button
              onClick={() => onEdit(stationId)}
              className="bg-[#f0f3f7] border border-[#e9e9e9] border-solid box-border content-stretch flex flex-col gap-[4px] items-center justify-center px-0 py-[16px] relative rounded-[12px] shrink-0 w-full"
            >
              <div className="content-stretch flex gap-[3px] items-start relative shrink-0">
                <div className="relative shrink-0 size-[16px]">
                  <Image alt="Edit icon" className="block max-w-none size-full" src="/public/assets/svg/uil-pen.svg" width={16} height={16} />
                </div>
                <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[#212229] text-[14px]">
                  {t('edit')}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
