'use client';

import { useProviderContext } from '@/contexts/ProviderContext';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { generateProviderSlug } from '@/lib/utils/slug';

import ProviderCamperTile from "@/components/provider/ProviderCamperTile";
import ProviderStationTile from "@/components/provider/ProviderStationTile";
import Button from "@/components/inputs/Button";
import {useState, useTransition, useEffect, useMemo} from "react";

export default function ProviderDetailsClient() {
  const t = useTranslations('dashboard');
  const tAddons = useTranslations('addons');
  const [, startTransition] = useTransition();
  const { providers, campers, stations, addons, activeProviderId } = useProviderContext();
  const [camperState, setCamperState] = useState(campers);
  const [stationState, setStationState] = useState(stations);

  const provider = activeProviderId ? providers.find(p => p.id === activeProviderId) : undefined;

  const filteredCampers = useMemo(() => {
    return provider ? campers.filter(camper => camper.provider_id === provider.id) : [];
  }, [provider, campers]);

  const filteredStations = useMemo(() => {
    return provider ? stations.filter(station => station.provider_id === provider.id) : [];
  }, [provider, stations]);

  const filteredAddons = useMemo(() => {
    return provider ? addons.filter(addon => addon.provider_id === provider.id) : [];
  }, [provider, addons]);

  useEffect(() => {
    setCamperState(filteredCampers);
  }, [filteredCampers]);

  useEffect(() => {
    setStationState(filteredStations);
  }, [filteredStations]);

  if (!provider) {
    return <p>Loading provider details...</p>; // Or a more sophisticated loading/error state
  }

  const handleToggleActive = async (camperId: number, isActive: boolean) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/de/api/camper/${camperId}/toggle-active`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive }),
        });

        if (res.ok) {
          setCamperState(prevCampers =>
              prevCampers.map(camper =>
                  camper.id === camperId ? { ...camper, active: isActive } : camper
              )
          );
        } else {
          const data = await res.json();
          console.error('Failed to toggle camper active status:', data.error);
          // Optionally show a user-friendly error message
        }
      } catch (error) {
        console.error('An unexpected error occurred while toggling camper active status:', error);
        // Optionally show a user-friendly error message
      }
    });
  };

  const handleToggleStationActive = async (stationId: number, isActive: boolean) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/de/api/station/${stationId}/toggle-active`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive }),
        });

        if (res.ok) {
          setStationState(prevStations =>
              prevStations.map(station =>
                  station.id === stationId ? { ...station, active: isActive } : station
              )
          );
        } else {
          const data = await res.json();
          console.error('Failed to toggle station active status:', data.error);
        }
      } catch (error) {
        console.error('An unexpected error occurred while toggling station active status:', error);
      }
    });
  };

  const providerSlug = generateProviderSlug(provider.company_name, provider.id);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-card shadow-lg rounded-lg p-8 border border-border">
          <h1 className="text-3xl font-bold mb-6">{provider.company_name}</h1>

          {/* Campers Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t('campers-title')}</h2>
              <Link href={{ pathname: '/provider/[slug]/campers', params: { slug: providerSlug } }} className="text-blue-500 hover:underline">
                {t('showAll')}
              </Link>
            </div>
            {camperState.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {camperState.map((camper) => (
                    <ProviderCamperTile camper={camper} key={camper.id} onToggleActive={handleToggleActive}>
                      <Link
                          className="w-full"
                          href={{
                        pathname: '/provider/[slug]/campers/[camperId]',
                        params: {slug: providerSlug, camperId: camper.id}
                      }}>
                        <Button>
                            {t('view_details')}
                        </Button>
                      </Link>
                    </ProviderCamperTile>
                ))}
              </div>
            ) : (
                <p>{t('no_campers_found')}</p>
            )}
          </div>

          {/* Stations Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t('stations-title')}</h2>
              <Link href={{pathname: '/provider/[slug]/stations', params: {slug: providerSlug } }} className="text-blue-500 hover:underline">
                {t('showAll')}
              </Link>
            </div>
            {stationState.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stationState.map((station) => (
                    <ProviderStationTile station={station} key={station.id} onToggleActive={(isActive) => handleToggleStationActive(station.id, isActive)}>
                        <Link
                            className="w-full"
                            href={{
                            pathname: '/provider/[slug]/stations/[id]',
                            params: {slug: providerSlug, id: station.id}
                        }}>
                            <Button className={"w-full"}>
                            {t('view_details')}
                            </Button>
                        </Link>
                    </ProviderStationTile>
                ))}
              </div>
            ) : (
              <p>{t('no_stations_found')}</p>
            )}
          </div>

          {/* Addons Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t('addons-title')}</h2>
              <Link href={{ pathname: '/provider/[slug]/addons', params: { slug: providerSlug } }} className="text-blue-500 hover:underline">
                {t('showAll')}
              </Link>
            </div>
            {filteredAddons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredAddons.map((addon) => (
                  <div key={addon.id} className="bg-muted p-4 rounded-lg shadow">
                    <h3 className="font-bold">{addon.name}</h3>
                    <p className="text-sm text-muted-foreground">{addon.price_per_unit}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>{tAddons('no_addons_available')}</p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
