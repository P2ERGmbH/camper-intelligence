'use client';

import { Camper } from '@/types/camper';
import { useTranslations } from 'next-intl';

interface ProviderCampersListProps {
  initialCampers: Camper[];
  error: string | null;
}

export default function ProviderCampersList({ initialCampers, error }: ProviderCampersListProps) {
  const t = useTranslations('dashboard');

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-card shadow-lg rounded-lg p-8 border border-border">
          <h1 className="text-3xl font-bold mb-6">{t('campers-title')}</h1>
          {initialCampers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {initialCampers.map((camper) => (
                <div key={camper.id} className="bg-muted p-4 rounded-lg shadow">
                  <h3 className="font-bold">{camper.name}</h3>
                  <p className="text-sm text-muted-foreground">{camper.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>{t('no_campers_found')}</p>
          )}
        </div>
      </main>
    </div>
  );
}