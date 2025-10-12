'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Station } from '@/types/station';

interface AdminStationsListProps {
  initialStations: Station[];
  error: string | null;
}

export default function AdminStationsList({ initialStations, error: serverError }: AdminStationsListProps) {
  const [stations, setStations] = useState<Station[]>(initialStations);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(serverError);
  const locale = useLocale();

  // Client-side re-fetching if needed, e.g., after an action
  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/${locale}/api/admin/stations`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Station[] = await response.json();
      setStations(data);
    } catch (err) {
      console.error('Failed to fetch stations:', err);
      setError('Failed to load stations.');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Optional: re-fetch on mount if initial data is empty or an error occurred on server
  useEffect(() => {
    if (initialStations.length === 0 && !serverError) {
      fetchStations();
    }
  }, [initialStations, serverError, fetchStations]);

  if (loading) {
    return <p className="text-foreground">Loading stations...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Station Management</h2>

      {stations.length === 0 ? (
        <p className="text-foreground">No stations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border border-foreground">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-foreground text-foreground">ID</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Ext ID</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Name</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">City</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Country</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Active</th>
                {/* Add other table headers as necessary */}
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr key={station.id} className="hover:bg-gray-800">
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{station.id}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{station.ext_id}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{station.name}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{station.city}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{station.country}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{station.active ? 'Yes' : 'No'}</td>
                  {/* Add other table data as necessary */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
