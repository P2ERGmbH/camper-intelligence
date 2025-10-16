'use client';

import React from 'react';
import Image from 'next/image';
import { Station } from '@/types/station';
import StationMap from '@/components/stations/StationMap';

interface StationTileProps {
  station: Station;
  slug: string;
  children: React.ReactNode;
}

export default function StationTile({ station, children }: StationTileProps) {
  return (
    <div key={station.id} className="border border-neutral-200 border-solid relative rounded-[16px] shrink-0 w-full" data-name="Station Tile" data-node-id="146:1420">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="aspect-[640/320] relative shrink-0 w-full" data-name="2:1 station image" data-node-id="146:1421">
          {station.lat && station.lng ? (
            <StationMap lat={station.lat} lng={station.lng} />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
              No map available
            </div>
          )}
        </div>
        <div className="bg-white box-border content-stretch flex flex-col gap-[4px] items-start pb-[24px] pt-[16px] px-[24px] relative shrink-0 w-full" data-name="Station Tile Description" data-node-id="146:1422">
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="146:1423">
            <div className="content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[2px] items-start relative shrink-0 text-black w-full" data-node-id="146:1424">
              <div className="content-stretch flex items-start justify-between leading-[1.2] relative shrink-0 text-[24px] tracking-[-0.1px] w-full" data-node-id="146:1425">
                <p className="relative shrink-0" data-node-id="146:1426">
                  {station.name}
                </p>
                <p className="relative shrink-0" data-node-id="146:1427">
                  {station.country}
                </p>
              </div>
              <div className="leading-[1.3] relative shrink-0 text-[14px] w-full whitespace-pre-wrap" data-node-id="146:1428">
                <p className="mb-0">{station.address}</p>
                <p>{station.postal_code} {station.city}</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 w-full" data-node-id="146:1429">
              <div className="content-stretch flex gap-[6px] items-center justify-center relative shrink-0 w-full" data-node-id="146:1430">
                <Image alt="" className="relative shrink-0 size-[16px]" src="/assets/svg/uil-phone-alt.svg" width={16} height={16} />
                <p className="flex-[1_0_0] font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] min-h-px min-w-px relative shrink-0 text-[14px] text-black whitespace-pre-wrap" data-node-id="146:1433">
                  Telefon
                </p>
              </div>
              <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0 w-full" data-node-id="146:1434">
                <div className="flex-[1_0_0] font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] min-h-px min-w-px relative shrink-0 text-[14px] text-black whitespace-pre-wrap" data-node-id="146:1435">
                  <p className="mb-0">{station.phone_number}</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative rounded-[8px] shrink-0 w-full" data-node-id="146:1436">
              <div className="content-stretch flex gap-[6px] items-center justify-center relative shrink-0 w-full" data-node-id="146:1437">
                <Image alt="" className="relative shrink-0 size-[16px]" src="/assets/svg/uil-house-user.svg" width={16} height={16} />
                <p className="flex-[1_0_0] font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] min-h-px min-w-px relative shrink-0 text-[14px] text-black whitespace-pre-wrap" data-node-id="146:1440">
                  Öffnungszeiten
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="146:1441">
                <div className="content-stretch flex font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal gap-[4px] items-center justify-center leading-[1.3] relative shrink-0 text-[14px] text-black w-full whitespace-pre-wrap" data-node-id="146:1442">
                  <p className="flex-[1_0_0] min-h-px min-w-px relative shrink-0" data-node-id="146:1443">
                    Mo.-Fr.
                  </p>
                  <p className="flex-[1_0_0] min-h-px min-w-px relative shrink-0" data-node-id="146:1444">
                    {station.weekday_text_monday}
                  </p>
                </div>
                <div className="content-stretch flex font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal gap-[4px] items-center justify-center leading-[1.3] relative shrink-0 text-[14px] text-black w-full whitespace-pre-wrap" data-node-id="146:1445">
                  <p className="flex-[1_0_0] min-h-px min-w-px relative shrink-0" data-node-id="146:1446">
                    Samstag
                  </p>
                  <p className="flex-[1_0_0] min-h-px min-w-px relative shrink-0" data-node-id="146:1447">
                    {station.weekday_text_saturday}
                  </p>
                </div>
                <div className="content-stretch flex font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal gap-[4px] items-center justify-center leading-[1.3] relative shrink-0 text-[14px] text-black w-full whitespace-pre-wrap" data-node-id="146:1448">
                  <p className="flex-[1_0_0] min-h-px min-w-px relative shrink-0" data-node-id="146:1449">
                    Sonntag
                  </p>
                  <p className="flex-[1_0_0] min-h-px min-w-px relative shrink-0" data-node-id="146:1450">
                    {station.weekday_open_sunday || "Geschlossen"}
                  </p>
                </div>
                <div className="content-stretch flex font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal gap-[4px] items-center justify-center leading-[1.3] relative shrink-0 text-[14px] text-black w-full whitespace-pre-wrap" data-node-id="146:1451">
                  <p className="flex-[1_0_0] min-h-px min-w-px relative shrink-0" data-node-id="146:1452">
                    Feiertag
                  </p>
                  <p className="flex-[1_0_0] min-h-px min-w-px relative shrink-0" data-node-id="146:1453">
                    {station.weekday_text_holiday || "Geschlossen"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="box-border content-stretch flex flex-col gap-[4px] items-start pb-0 pt-[16px] px-0 relative shrink-0 w-full" data-node-id="146:1454">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
