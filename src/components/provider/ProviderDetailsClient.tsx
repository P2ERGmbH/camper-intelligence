'use client';

import { Provider } from '@/types/provider';
import { CamperWIthTileImage } from '@/types/camper';
import { Station } from '@/types/station';
import { Addon } from '@/types/addon';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { generateProviderSlug } from '@/lib/utils/slug';

import ProviderCamperTile from "@/components/provider/ProviderCamperTile";
import ProviderStationTile from "@/components/provider/ProviderStationTile";
import Button from "@/components/inputs/Button";
import {useState, useTransition} from "react";

interface ProviderDetailsClientProps {
  provider: Provider;
  campers: CamperWIthTileImage[];
  stations: Station[];
  addons: Addon[];
}

export default function ProviderDetailsClient({ provider, campers, stations, addons }: ProviderDetailsClientProps) {
  const t = useTranslations('dashboard');
  const tAddons = useTranslations('addons');
  const [, startTransition] = useTransition();
  const [camperState, setCampers] = useState(campers);

  const handleToggleActive = async (camperId: number, isActive: boolean) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/de/api/camper/${camperId}/toggle-active`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive }),
        });

        if (res.ok) {
          setCampers(prevCampers =>
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
            {stations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stations.map((station) => (
                    <ProviderStationTile station={station} key={station.id}>
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
            {addons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {addons.map((addon) => (
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
