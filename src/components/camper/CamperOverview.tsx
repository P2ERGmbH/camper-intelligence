
import Image from 'next/image';
import {Camper} from "@/types/camper";
import {Image as ImageType} from "@/types/image";

export function CamperOverview({camper, providerLogo}: {camper:Camper, providerLogo?: ImageType|null}) {
  return (
    <div className="bg-white border border-[#d6dfe5] border-solid box-border content-stretch grid grid-cols-1 lg:grid-cols-[1fr_auto] items-start justify-between px-4 py-6 lg:px-[40px] lg:py-[32px] relative rounded-[16px] shrink-0 w-full" data-name="overview" data-node-id="171:281">
      <div className="content-stretch flex flex-col gap-[20px] items-start min-h-px min-w-px relative shrink-0" data-node-id="171:313">
        <div className="content-stretch flex gap-[28px] items-start relative shrink-0" data-node-id="171:593">
          <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-node-id="171:304">
            <div className="bg-[#44d1b2] rounded-[12px] shrink-0 size-[14px]" data-node-id="171:305" />
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.2] relative shrink-0 text-[#7d838c] text-[16px] tracking-[-0.1px]" data-node-id="171:303">
              {camper.active ? 'Aktiv' : 'Inaktiv'}
            </p>
          </div>
          <div className="content-stretch flex gap-[6px] items-center justify-center leading-[1.2] relative shrink-0 text-[16px] tracking-[-0.1px]" data-node-id="171:594">
            <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold relative shrink-0 text-[#212229]" data-node-id="171:596">
              ID
            </p>
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[#7d838c]" data-node-id="171:597">
              {camper.ext_id}
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="171:314">
          <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="171:1082">
            <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.15] relative shrink-0 text-[#212229] text-3xl lg:text-[48px] tracking-[-0.25px] w-full whitespace-pre-wrap" data-node-id="171:280">
              {camper.name}
            </p>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0" data-node-id="171:1083">
              <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.2] relative shrink-0 text-[#7d838c] text-base lg:text-[18px] tracking-[-0.1px]" data-node-id="171:1086">
                {camper.variant}
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="171:1088">
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] overflow-ellipsis overflow-hidden relative shrink-0 text-[#232d34] text-base lg:text-[18px] w-full lg:w-[1138px] whitespace-nowrap" data-node-id="171:1080">
              {camper.description}
            </p>
          </div>
        </div>
      </div>
      {providerLogo ? (
        <div className="h-[45px] relative shrink-0 w-[110px] mt-4 lg:mt-0 lg:justify-self-end" data-name="jucy-logo-white-einheitlich 1" data-node-id="171:316">
          <Image alt="Jucy Logo" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={providerLogo.url} width={providerLogo.width} height={providerLogo.height} />
        </div>
      ) : null}
    </div>
  );
}
