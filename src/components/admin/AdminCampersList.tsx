'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Camper } from '@/types/camper';
import { Link } from '@/i18n/routing';

interface AdminCampersListProps {
  initialCampers: (Camper & { providerName?: string })[];
  error: string | null;
}

export default function AdminCampersList({ initialCampers, error: serverError }: AdminCampersListProps) {
  const [campers, setCampers] = useState<(Camper & { providerName?: string })[]>(initialCampers);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(serverError);
  const locale = useLocale();

  // Client-side re-fetching if needed, e.g., after an action
  const fetchCampers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/${locale}/api/admin/campers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Camper[] = await response.json();
      setCampers(data);
    } catch (err) {
      console.error('Failed to fetch campers:', err);
      setError('Failed to load campers.');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Optional: re-fetch on mount if initial data is empty or an error occurred on server
  useEffect(() => {
    if (initialCampers.length === 0 && !serverError) {
      fetchCampers();
    }
  }, [initialCampers, serverError, fetchCampers]);

  if (loading) {
    return <p className="text-foreground">Loading campers...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Camper Management</h2>

      {campers.length === 0 ? (
        <p className="text-foreground">No campers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border border-foreground">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-foreground text-foreground">ID</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Ext ID</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Name</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Provider Name</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Active</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Variant</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Rating</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Sleeps Adults</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Actions</th>
                {/* Add other table headers as necessary */}
              </tr>
            </thead>
            <tbody>
              {campers.map((camper) => (
                <tr key={camper.id} className="hover:bg-gray-800">
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{camper.id}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{camper.ext_id}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{camper.name}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{camper.providerName}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{camper.active ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{camper.variant}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{camper.rating}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{camper.sleeps_adults}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">
                    <Link href={{ pathname: '/provider/[slug]/campers/[id]/edit', params: { slug: camper.provider_id, id: camper.id } }} className="text-blue-500 hover:underline">
                      Edit
                    </Link>
                  </td>
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
