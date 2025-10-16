'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Camper } from '@/types/camper';
import { Station } from '@/types/station';
import { Link } from '@/i18n/routing';
import StationTile from "@/components/stations/StationTile";
import { handleCamperMappingAction } from '@/app/[locale]/provider/[slug]/stations/actions';
import StationTileMinimal from "@/components/stations/StationTileMinimal";
import Image from "next/image";

interface CamperStationAssignmentProps {
  camper: Camper;
  providerStations: Station[];
  slug: string;
}

function renderButton(label:string, icon:string="/assets/svg/uil-pen.svg") {
  return (
      <div
          className="bg-[#f0f3f7] border border-[#e9e9e9] border-solid box-border content-stretch flex flex-col gap-[4px] items-center justify-center px-0 py-[16px] relative rounded-[12px] shrink-0 w-full"
          data-name="Button" data-node-id="171:1027">
        <div className="content-stretch flex gap-[3px] items-start relative shrink-0"
             data-node-id="171:1028">
          <div className="relative shrink-0 size-[16px]" data-name="uil:pen" data-node-id="171:1029">
            <Image alt="Edit" className="block max-w-none size-full" src={icon}
                   width={16}
                   height={16}/>
          </div>
          <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.3] relative shrink-0 text-[#212229] text-[14px]">{label}</p>
        </div>
      </div>
  );
}

export default function CamperStationAssignment({
                                                  camper,
                                                  providerStations,
                                                  slug,
                                                }: CamperStationAssignmentProps) {
  const t = useTranslations('dashboard');
  const [assignedStations, setAssignedStations] = useState(providerStations.filter(station => station.id === camper.station_id));
  const [unassignedStations, setUnassignedStations] = useState(providerStations.filter(station => station.id !== camper.station_id));
  const [isPending, startTransition] = useTransition();

  const handleAssignment = (stationId: number, assign: boolean) => {
    startTransition(async () => {
      await handleCamperMappingAction(camper.id, assign ? stationId : null, slug, stationId.toString());

      if (assign) {
        const assigned = unassignedStations.find(s => s.id === stationId);
        if (assigned) {
          setAssignedStations(prev => [...prev, assigned]);
          setUnassignedStations(prev => prev.filter(s => s.id !== stationId));
        }
      } else {
        const unassigned = assignedStations.find(s => s.id === stationId);
        if (unassigned) {
          setUnassignedStations(prev => [...prev, unassigned]);
          setAssignedStations(prev => prev.filter(s => s.id !== stationId));
        }
      }
    });
  };
    return (
    <div className="space-y-6">
      {/* Assigned Station */}
      <section className="bg-white border border-[#d6dfe5] border-solid box-border content-stretch flex flex-col gap-[44px] items-start px-[40px] py-[32px] relative rounded-[16px] shrink-0 w-full">
        <h3 className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[#212229] text-[32px] tracking-[-0.2px]">{t('assigned_station_title')}</h3>
        {assignedStations?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {assignedStations.map((station) => {
                return (
                    <StationTileMinimal station={station} slug={slug} key={station.id}>
                      <Link href={{pathname: '/provider/[slug]/stations/[id]', params: {slug, id: station.id}}} className="w-full">
                        {renderButton(t('edit_station_button'))}
                      </Link>
                      <button
                          className="w-full"
                          onClick={() => handleAssignment(station.id, false)}
                          disabled={isPending}
                          data-name="Button" data-node-id="171:1027">
                        {renderButton(isPending ? t('updating') : t('remove_station_button'), "/assets/svg/icon-cancel-1.svg")}
                      </button>
                    </StationTileMinimal>
                )
              })}
            </div>

        ) : (
            <p className="text-gray-600 dark:text-gray-400">{t('no_assigned_station')}</p>
        )}
      </section>

      {/* Unassigned Stations */}
      <section
          className="bg-white border border-[#d6dfe5] border-solid box-border content-stretch flex flex-col gap-[44px] items-start px-[40px] py-[32px] relative rounded-[16px] shrink-0 w-full">
        <h3 className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[#212229] text-[32px] tracking-[-0.2px]">{t('unassigned_stations_title')}
      </h3>
      {unassignedStations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {unassignedStations.map(station => (
                  <StationTileMinimal station={station} slug={slug} key={station.id}>
                    <Link href={{pathname: '/provider/[slug]/stations/[id]', params: {slug, id: station.id}}}
                          className="w-full">
                      {renderButton(t('edit_station_button'))}
                    </Link>
                    <button
                        className="w-full"
                        onClick={() => handleAssignment(station.id, true)}
                        disabled={isPending}
                        data-name="Button" data-node-id="171:1027">
                      {renderButton(isPending ? t('updating') : t('assign_station_button'), "/assets/svg/uil-plus-circle-1.svg")}
                    </button>
                  </StationTileMinimal>
              ))}
            </div>
        ) : (
            <p className="text-gray-600 dark:text-gray-400">{t('all_stations_assigned')}</p>
        )}
      </section>
    </div>
    );
}
