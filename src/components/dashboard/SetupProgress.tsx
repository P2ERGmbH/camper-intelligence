'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function SetupProgress() {
  const t = useTranslations('dashboard');
  const [progress, setProgress] = useState({ legal: false, stations: false, campers: false });

  useEffect(() => {
    const fetchData = async () => {
      // In a real app, you would fetch the actual data from your API
      // For now, we'll just simulate the data fetching
      const legalData = await Promise.resolve({ company_name: 'Test' }); // Simulate fetched data
      const stationsData = await Promise.resolve([]); // Simulate fetched data
      const campersData = await Promise.resolve([]); // Simulate fetched data

      setProgress({
        legal: !!legalData.company_name,
        stations: stationsData.length > 0,
        campers: campersData.length > 0,
      });
    };
    fetchData();
  }, []);

  const completionPercentage = Object.values(progress).filter(Boolean).length / Object.values(progress).length * 100;

  const nextStep = () => {
    if (!progress.legal) {
      return { text: t('progress-next_step_legal'), link: '/provider/dashboard/legal' };
    }
    if (!progress.stations) {
      return { text: t('progress-next_step_stations'), link: '/provider/dashboard/stations' };
    }
    if (!progress.campers) {
      return { text: t('progress-next_step_campers'), link: '/provider/dashboard/campers' };
    }
    return null;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('progress-title')}</h2>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
      </div>
      <div className="text-right text-sm font-medium text-gray-600">{`${Math.round(completionPercentage)}% ${t('progress-complete')}`}</div>
      {nextStep() && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900">{t('progress-next_step')}</h3>
          <p className="text-gray-600 mt-2">
            {nextStep()?.text}
          </p>
          <Link href={nextStep()!.link} className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
            {t('progress-go_to_next_step')}
          </Link>
        </div>
      )}
    </div>
  );
}
