'use client';

import React, { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Camper } from '@/types/camper';
import { handleCamperMappingAction } from '@/app/[locale]/provider/[slug]/stations/actions';

interface CamperStationAssignmentButtonsProps {
  camper: Camper;
  slug: string;
  isMapped: boolean;
  currentStationId: string;
}

export default function CamperStationAssignmentButtons({
  camper,
  slug,
  isMapped,
  currentStationId,
}: CamperStationAssignmentButtonsProps) {
  const t = useTranslations('dashboard');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const handleAssignment = (assign: boolean) => {
    startTransition(async () => {
      await handleCamperMappingAction(camper.id, assign ? parseInt(currentStationId) : null, slug, currentStationId);
    });
  };

  return (
    <div className="mt-4">
      {isMapped ? (
        <button
          onClick={() => handleAssignment(false)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
        >
          {t('unassign_camper_button')}
        </button>
      ) : (
        <button
          onClick={() => handleAssignment(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
        >
          {t('assign_camper_button')}
        </button>
      )}
    </div>
  );
}
