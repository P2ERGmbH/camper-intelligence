
'use client';

import { Addon } from '@/types/addon';
import { useTranslations } from 'next-intl';

interface ProviderAddonsListProps {
  initialAddons: Addon[];
  error: string | null;
}

export default function ProviderAddonsList({ initialAddons, error }: ProviderAddonsListProps) {
  const t = useTranslations('dashboard');

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-card shadow-lg rounded-lg p-8 border border-border">
          <h1 className="text-3xl font-bold mb-6">{t('addons-title')}</h1>
          {initialAddons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {initialAddons.map((addon) => (
                <div key={addon.id} className="bg-muted p-4 rounded-lg shadow">
                  <h3 className="font-bold">{addon.name}</h3>
                  <p className="text-sm text-muted-foreground">{addon.price_per_unit}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>{t('no_addons_available')}</p>
          )}
        </div>
      </main>
    </div>
  );
}
