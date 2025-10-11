'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Station } from '@/types/station';

interface StationListProps {
  locale: string;
}

export default function StationList({ locale }: StationListProps) {
  const t = useTranslations('dashboard');
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/${locale}/api/provider/stations`);
        if (res.ok) {
          const data = await res.json();
          setStations(data);
        }
      } catch (error: unknown) {
        console.error('Failed to fetch stations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, [locale]);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      {loading ? (
        <p>Loading stations...</p>
      ) : stations.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {stations.map((station) => (
            <li key={station.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">{station.name}</p>
                <p className="text-sm text-gray-600">{station.address}</p>
              </div>
              <Link 
                href={{
                  pathname: '/provider/dashboard/stations/[id]',
                  params: { id: station.id }
                }} 
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>{t('no_stations_found')}</p>
      )}
    </div>
  );
}
