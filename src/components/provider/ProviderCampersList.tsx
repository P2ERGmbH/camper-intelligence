'use client';

import { useState, useTransition } from 'react';
import {CamperWIthTileImage} from '@/types/camper';
import { useTranslations } from 'next-intl';
import ProviderCamperTile from '@/components/provider/ProviderCamperTile';
import Button from "@/components/inputs/Button";
import {Link} from "@/i18n/routing";

interface ProviderCampersListProps {
  initialCampers: CamperWIthTileImage[];
  error: string | null;
  slug: string;
}

export default function ProviderCampersList({ initialCampers, error, slug }: ProviderCampersListProps) {
  const t = useTranslations('dashboard');
  const [campers, setCampers] = useState(initialCampers);
  const [, startTransition] = useTransition();

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

  const activeCampers = campers.filter(camper => camper.active);
  const inactiveCampers = campers.filter(camper => !camper.active);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white dark:bg-[#13142a] rounded-4xl p-7 border border-border">
          <h1 className="text-3xl font-bold mb-6">{t('campers-title')}</h1>

          {activeCampers.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('active_campers')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCampers.map((camper) => (
                    <ProviderCamperTile
                        key={camper.id}
                        camper={camper}
                        onToggleActive={handleToggleActive}
                    >
                      <Link
                          className="w-full"
                          href={{
                            pathname: '/provider/[slug]/campers/[camperId]',
                            params: {slug: slug, camperId: camper.id}
                          }}>
                        <Button>
                          {t('edit_camper')}
                        </Button>
                      </Link>
                    </ProviderCamperTile>
                ))}
              </div>
            </section>
          )}

          {inactiveCampers.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('inactive_campers')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactiveCampers.map((camper) => (
                  <ProviderCamperTile
                    key={camper.id}
                    camper={camper}
                    onToggleActive={handleToggleActive}
                  >
                    <Link
                        className="w-full"
                        href={{
                          pathname: '/provider/[slug]/campers/[camperId]',
                          params: {slug: slug, camperId: camper.id}
                        }}>
                      <Button>
                        {t('edit_camper')}
                      </Button>
                    </Link>
                  </ProviderCamperTile>
                ))}
              </div>
            </section>
          )}

          {activeCampers.length === 0 && inactiveCampers.length === 0 && (
            <p>{t('no_campers_found')}</p>
          )}
        </div>
      </div>
    </div>
  );
}