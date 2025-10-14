'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';

interface NextStepLink {
  pathname: '/provider/[slug]/legal' | '/provider/[slug]/stations' | '/provider/[slug]/campers';
  params: { slug: string };
}

export default function SetupProgress() {
  const t = useTranslations('dashboard');
  const params = useParams();
  const { slug: rawSlug } = params;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || '';
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

  const nextStep = (): NextStepLink | null => {
    if (!progress.legal) {
      return { pathname: '/provider/[slug]/legal', params: { slug } };
    }
    if (!progress.stations) {
      return { pathname: '/provider/[slug]/stations', params: { slug } };
    }
    if (!progress.campers) {
      return { pathname: '/provider/[slug]/campers', params: { slug } };
    }
    return null;
  };

  const currentNextStep = nextStep();

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('progress-title')}</h2>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
      </div>
      <div className="text-right text-sm font-medium text-gray-600">{`${Math.round(completionPercentage)}% ${t('progress-complete')}`}</div>
      {currentNextStep && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900">{t('progress-next_step')}</h3>
          <p className="text-gray-600 mt-2">
            {t(`progress-next_step_${currentNextStep.pathname.split('/').pop()}`)}
          </p>
          {currentNextStep.pathname === '/provider/[slug]/legal' && (
            <Link href={{ pathname: '/provider/[slug]/legal', params: { slug } }} className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
              {t('progress-go_to_next_step')}
            </Link>
          )}
          {currentNextStep.pathname === '/provider/[slug]/stations' && (
            <Link href={{ pathname: '/provider/[slug]/stations', params: { slug } }} className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
              {t('progress-go_to_next_step')}
            </Link>
          )}
          {currentNextStep.pathname === '/provider/[slug]/campers' && (
            <Link href={{ pathname: '/provider/[slug]/campers', params: { slug } }} className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
              {t('progress-go_to_next_step')}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
