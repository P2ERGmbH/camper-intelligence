'use client';

import React from 'react';
import Image from 'next/image';
import { StationWithImageTile } from '@/types/station';


interface StationTileProps {
  station: StationWithImageTile;
  slug: string;
  children: React.ReactNode;
}

export default function StationTileMinimal({ station, children }: StationTileProps) {
  return (
      <div className="border border-neutral-200 border-solid relative rounded-[16px]" data-name="Station Tile"
           data-node-id="171:992">
        <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit]">
          <div className="aspect-[640/320] relative shrink-0 w-full" data-name="2:1 station image"
               data-node-id="171:993">
            <Image alt={station?.imageTile?.alt_text || station.name || "Station Image"}
                   className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                   src={station?.imageTile?.url || "/assets/img/station-image-2.png"} width={640} height={320}/>
          </div>
          <div
              className="bg-white box-border content-stretch flex flex-col gap-[36px] items-start pb-[24px] pt-[20px] px-[24px] relative shrink-0 w-full"
              data-name="Station Tile Description" data-node-id="171:994">
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full"
                 data-node-id="171:995">
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full"
                   data-node-id="171:996">
                <div
                    className="content-stretch flex font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-center justify-center leading-[1.2] relative shrink-0 text-[#212229] text-[24px] tracking-[-0.1px] w-full"
                    data-node-id="171:997">
                  <p className="flex-[1_0_0] min-h-px min-w-px relative shrink-0 whitespace-pre-wrap"
                     data-node-id="171:998">
                    {station.city}
                  </p>
                  <p className="relative shrink-0" data-node-id="171:999">
                    {station.country_code ? `\uD83C\uDDE6\uD83C\uDDE8` : ''}
                  </p>
                </div>
                <div
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#4d616e] text-[14px] w-full whitespace-pre-wrap"
                    data-node-id="171:1000">
                  <p className="mb-0">{station.street} {station.street_number}</p>
                  <p>{station.postal_code} {station.city}</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full"
                 data-node-id="171:1026">
                  {children}
            </div>
          </div>
        </div>
      </div>
  );
}
