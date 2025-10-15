'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';

interface StationStatusToggleProps {
  stationId: number;
  initialStatus: boolean;
  onToggleStatus: (newStatus: boolean) => Promise<void>;
}

export default function StationStatusToggle({ stationId, initialStatus, onToggleStatus }: StationStatusToggleProps) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('dashboard'); // Assuming dashboard has relevant translations

  const handleToggle = () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    startTransition(async () => {
      await onToggleStatus(newStatus);
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor={`toggle-station-${stationId}`} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id={`toggle-station-${stationId}`}
            className="sr-only"
            checked={isActive}
            onChange={handleToggle}
            disabled={isPending}
          />
          <div className={`block w-14 h-8 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-600'}`}>
          </div>
          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isActive ? 'translate-x-full' : ''}`}>
          </div>
        </div>
        <div className="ml-3 text-gray-700 font-medium dark:text-gray-300">
          {isActive ? t('station_status_active') : t('station_status_inactive')}
        </div>
      </label>
      {isPending && <p className="text-sm text-gray-500">Updating...</p>}
    </div>
  );
}
