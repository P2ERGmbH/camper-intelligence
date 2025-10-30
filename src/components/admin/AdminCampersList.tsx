'use client';

import {useState, useEffect, useCallback} from 'react';
import {useLocale} from 'next-intl';
import {Camper, CamperWIthTileImage} from '@/types/camper';
import {Link} from '@/i18n/routing';
import SearchResultsList from "@/components/search/SearchResultsList";
import {ProviderWithImageTile} from "@/types/provider";

interface AdminCampersListProps {
    initialCampers: (CamperWIthTileImage & { providerName?: string })[];
    error: string | null;
}

export default function AdminCampersList({initialCampers, error: serverError}: AdminCampersListProps) {
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
        <div className="bg-white dark:bg-[#13142a] rounded-4xl p-7">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Camper Management</h2>

            {campers.length === 0 ? (
                <p className="text-foreground">No campers found.</p>
            ) : (
                <SearchResultsList campers={campers}/>
            )}
        </div>
    );
}
