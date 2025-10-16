
import Image from 'next/image';

export function CamperStations() {
  return (
    <div className="bg-white border border-[#d6dfe5] border-solid box-border content-stretch flex flex-col gap-[44px] items-start px-[40px] py-[32px] relative rounded-[16px] shrink-0 w-full" data-name="stations" data-node-id="171:599">
      <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[#212229] text-[32px] tracking-[-0.2px]" data-node-id="171:600">
        Stationen
      </p>
      <div className="content-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full" data-name="Station Tiles" data-node-id="171:951">
        <div className="border border-neutral-200 border-solid relative rounded-[16px]" data-name="Station Tile" data-node-id="171:952">
          <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit]">
            <div className="aspect-[640/320] relative shrink-0 w-full" data-name="2:1 station image" data-node-id="171:953">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image alt="Station Image 1" className="absolute h-[200%] left-0 max-w-none top-[-50%] w-full" src="/assets/img/station-image-1.png" width={640} height={320} />
              </div>
            </div>
            <div className="bg-white box-border content-stretch flex flex-col gap-[36px] items-start pb-[24px] pt-[20px] px-[24px] relative shrink-0 w-full" data-name="Station Tile Description" data-node-id="171:954">
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="171:955">
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="171:956">
                  <div className="content-stretch flex font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold items-start justify-between leading-[1.2] relative shrink-0 text-[#212229] text-[24px] tracking-[-0.1px] w-full" data-node-id="171:957">
                    <p className="relative shrink-0" data-node-id="171:958">
                      Vancouver
                    </p>
                    <p className="relative shrink-0" data-node-id="171:959">
                      🇨🇦
                    </p>
                  </div>
                  <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#4d616e] text-[14px] w-full whitespace-pre-wrap" data-node-id="171:960">
                    <p className="mb-0">7731 Vantage Way</p>
                    <p>V4G 1A6 Delta</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="171:986">
                <div className="bg-[#f0f3f7] border border-[#e9e9e9] border-solid box-border content-stretch flex flex-col gap-[4px] items-center justify-center px-0 py-[16px] relative rounded-[12px] shrink-0 w-full" data-name="Button" data-node-id="171:987">
                  <div className="content-stretch flex gap-[3px] items-start relative shrink-0" data-node-id="171:988">
                    <div className="relative shrink-0 size-[16px]" data-name="uil:pen" data-node-id="171:989">
                      <Image alt="Edit" className="block max-w-none size-full" src="/assets/svg/uil-pen.svg" width={16} height={16} />
                    </div>
                    <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[#212229] text-[14px]" data-node-id="171:991">
                      Bearbeiten
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-neutral-200 border-solid relative rounded-[16px]" data-name="Station Tile" data-node-id="171:992">
          <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit]">
            <div className="aspect-[640/320] relative shrink-0 w-full" data-name="2:1 station image" data-node-id="171:993">
              <Image alt="Station Image 2" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src="/assets/img/station-image-2.png" width={640} height={320} />
            </div>
            <div className="bg-white box-border content-stretch flex flex-col gap-[36px] items-start pb-[24px] pt-[20px] px-[24px] relative shrink-0 w-full" data-name="Station Tile Description" data-node-id="171:994">
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="171:995">
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="171:996">
                  <div className="content-stretch flex font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-center justify-center leading-[1.2] relative shrink-0 text-[#212229] text-[24px] tracking-[-0.1px] w-full" data-node-id="171:997">
                    <p className="flex-[1_0_0] min-h-px min-w-px relative shrink-0 whitespace-pre-wrap" data-node-id="171:998">
                      Las Vegas
                    </p>
                    <p className="relative shrink-0" data-node-id="171:999">
                      🇺🇸
                    </p>
                  </div>
                  <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#4d616e] text-[14px] w-full whitespace-pre-wrap" data-node-id="171:1000">
                    <p className="mb-0">3050 W Sirius Ave, Suite 102</p>
                    <p>89102 Las Vegas</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="171:1026">
                <div className="bg-[#f0f3f7] border border-[#e9e9e9] border-solid box-border content-stretch flex flex-col gap-[4px] items-center justify-center px-0 py-[16px] relative rounded-[12px] shrink-0 w-full" data-name="Button" data-node-id="171:1027">
                  <div className="content-stretch flex gap-[3px] items-start relative shrink-0" data-node-id="171:1028">
                    <div className="relative shrink-0 size-[16px]" data-name="uil:pen" data-node-id="171:1029">
                      <Image alt="Edit" className="block max-w-none size-full" src="/assets/svg/uil-pen.svg" width={16} height={16} />
                    </div>
                    <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[#212229] text-[14px]" data-node-id="171:1031">
                      Bearbeiten
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-neutral-200 border-solid relative rounded-[16px]" data-name="Station Tile" data-node-id="171:1032">
          <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit]">
            <div className="aspect-[640/320] relative shrink-0 w-full" data-name="2:1 station image" data-node-id="171:1033">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image alt="Station Image 1" className="absolute h-[200%] left-0 max-w-none top-[-50%] w-full" src="/assets/img/station-image-1.png" width={640} height={320} />
              </div>
            </div>
            <div className="bg-white box-border content-stretch flex flex-col gap-[36px] items-start pb-[24px] pt-[20px] px-[24px] relative shrink-0 w-full" data-name="Station Tile Description" data-node-id="171:1034">
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="171:1035">
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="171:1036">
                  <div className="content-stretch flex font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold items-start justify-between leading-[1.2] relative shrink-0 text-[#212229] text-[24px] tracking-[-0.1px] w-full" data-node-id="171:1037">
                    <p className="relative shrink-0" data-node-id="171:1038">
                      Vancouver
                    </p>
                    <p className="relative shrink-0" data-node-id="171:1039">
                      🇨🇦
                    </p>
                  </div>
                  <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#4d616e] text-[14px] w-full whitespace-pre-wrap" data-node-id="171:1040">
                    <p className="mb-0">7731 Vantage Way</p>
                    <p>V4G 1A6 Delta</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="171:1066">
                <div className="bg-[#f0f3f7] border border-[#e9e9e9] border-solid box-border content-stretch flex flex-col gap-[4px] items-center justify-center px-0 py-[16px] relative rounded-[12px] shrink-0 w-full" data-name="Button" data-node-id="171:1067">
                  <div className="content-stretch flex gap-[3px] items-start relative shrink-0" data-node-id="171:1068">
                    <div className="relative shrink-0 size-[16px]" data-name="uil:pen" data-node-id="171:1069">
                      <Image alt="Edit" className="block max-w-none size-full" src="/assets/svg/uil-pen.svg" width={16} height={16} />
                    </div>
                    <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[#212229] text-[14px]" data-node-id="171:1071">
                      Bearbeiten
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-2 border-[#acacac] border-dashed relative rounded-[16px]" data-name="Add Station Tile" data-node-id="171:1072">
          <div className="content-stretch flex flex-col gap-[16px] items-center justify-center overflow-clip relative rounded-[inherit]">
            <div className="relative shrink-0 size-[56px]" data-name="uil:plus-circle" data-node-id="171:1073">
              <Image alt="Add Station" className="block max-w-none size-full" src="/assets/svg/uil-plus-circle.svg" width={56} height={56} />
            </div>
            <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[#212229] text-[16px]" data-node-id="171:1075">
              Station hinzufügen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
