'use client';

import React, { useTransition } from 'react';
import StationStatusToggle from '@/components/stations/StationStatusToggle';
import { toggleStationStatusAction } from '@/app/[locale]/provider/[slug]/stations/actions';

interface StationStatusToggleClientProps {
  stationId: number;
  initialStatus: boolean;
  slug: string;
  currentStationId: string;
}

export default function StationStatusToggleClient({
  stationId,
  initialStatus,
  slug,
  currentStationId,
}: StationStatusToggleClientProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const handleToggleStatus = async (newStatus: boolean): Promise<void> => {
    await toggleStationStatusAction(stationId, newStatus, slug, currentStationId);
  };

  return (
    <StationStatusToggle
      stationId={stationId}
      initialStatus={initialStatus}
      onToggleStatus={handleToggleStatus}
    />
  );
}
