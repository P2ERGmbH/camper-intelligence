'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Camper } from '@/types/camper';
import { StationWithImageTile } from '@/types/station';
import { Link } from '@/i18n/routing';

import { handleCamperMappingAction } from '@/app/[locale]/provider/[slug]/stations/actions';
import ProviderStationTile from "@/components/provider/ProviderStationTile";
import Button from "@/components/inputs/Button";

interface CamperStationAssignmentProps {
  camper: Camper;
  providerStations: StationWithImageTile[];
  slug: string;
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
                    <ProviderStationTile station={station} slug={slug} key={station.id}>
                      <Link href={{pathname: '/provider/[slug]/stations/[id]', params: {slug, id: station.id}}} className="w-full">
                        <Button>
                          {t('edit_station_button')}
                        </Button>
                      </Link>
                      <Button
                          onClick={() => handleAssignment(station.id, false)}
                          disabled={isPending}
                          icon={"/assets/svg/icon-cancel-1.svg"}>
                        {isPending ? t('updating') : t('remove_station_button')}
                      </Button>
                    </ProviderStationTile>
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
                  <ProviderStationTile station={station} slug={slug} key={station.id}>
                    <Link href={{pathname: '/provider/[slug]/stations/[id]', params: {slug, id: station.id}}}
                          className="w-full">
                      <Button>
                        {t('edit_station_button')}
                      </Button>
                    </Link>
                    <Button
                        onClick={() => handleAssignment(station.id, true)}
                        disabled={isPending}
                        icon={"/assets/svg/uil-plus-circle-1.svg"}
                    >
                      {isPending ? t('updating') : t('assign_station_button')}
                    </Button>
                  </ProviderStationTile>
              ))}
            </div>
        ) : (
            <p className="text-gray-600 dark:text-gray-400">{t('all_stations_assigned')}</p>
        )}
      </section>
    </div>
    );
}
