'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Camper } from '@/types/camper';
import { Station } from '@/types/station';
import { Link } from '@/i18n/routing';
import StationTile from "@/components/stations/StationTile";
import { handleCamperMappingAction } from '@/app/[locale]/provider/[slug]/stations/actions';

interface CamperStationAssignmentProps {
  camper: Camper;
  allStations: Station[];
  slug: string;
}

export default function CamperStationAssignment({
  camper,
  allStations,
  slug,
}: CamperStationAssignmentProps) {
  const t = useTranslations('dashboard');
  const [assignedStations, setAssignedStations] = useState(allStations.filter(station => station.id === camper.station_id));
  const [unassignedStations, setUnassignedStations] = useState(allStations.filter(station => station.id !== camper.station_id));
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
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{t('assigned_station_title')}</h3>
            {assignedStations?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assignedStations.map((station) => {
                        return (
                            <StationTile station={station} slug={slug} key={station.id}>
                                <Link href={{pathname: '/provider/[slug]/stations/[id]', params: {slug, id: station.id}}}>
                                    <p className="text-gray-700 dark:text-gray-300 hover:underline">Bearbeiten</p>
                                </Link>
                                <button
                                  onClick={() => handleAssignment(station.id, false)}
                                  disabled={isPending}
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                                >
                                  {isPending ? t('updating') : t('unassign_station_button')}
                                </button>
                            </StationTile>
                        )
                    })}
                </div>

            ) : (
                <p className="text-gray-600 dark:text-gray-400">{t('no_assigned_station')}</p>
            )}
      </section>

      {/* Unassigned Stations */}
      <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{t('unassigned_stations_title')}</h3>
        {unassignedStations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unassignedStations.map(station => (
                <StationTile station={station} slug={slug} key={station.id}>
                    <Link href={{ pathname: '/provider/[slug]/stations/[id]', params: { slug, id: station.id } }}>
                      <p className="text-gray-700 dark:text-gray-300 hover:underline">Bearbeiten</p>
                    </Link>
                    <button
                      onClick={() => handleAssignment(station.id, true)}
                      disabled={isPending}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      {isPending ? t('updating') : t('assign_station_button')}
                    </button>
                </StationTile>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">{t('all_stations_assigned')}</p>
        )}
      </section>
    </div>
  );
}
