'use client';

import { Provider } from '@/types/provider';
import { Camper } from '@/types/camper';
import { Station } from '@/types/station';
import { Addon } from '@/types/addon';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { generateProviderSlug } from '@/lib/utils/slug';

interface ProviderDetailsClientProps {
  provider: Provider;
  campers: Camper[];
  stations: Station[];
  addons: Addon[];
}

export default function ProviderDetailsClient({ provider, campers, stations, addons }: ProviderDetailsClientProps) {
  const t = useTranslations('dashboard');

  const providerSlug = generateProviderSlug(provider.company_name, provider.id);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-card shadow-lg rounded-lg p-8 border border-border">
          <h1 className="text-3xl font-bold mb-6">{provider.name} ({provider.company_name})</h1>

          {/* Campers Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t('campers-title')}</h2>
              <Link href={{ pathname: '/provider/[slug]/campers', params: { slug: providerSlug } }} className="text-blue-500 hover:underline">
                {t('showAll')}
              </Link>
            </div>
            {campers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {campers.map((camper) => (
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

          {/* Stations Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t('stations-title')}</h2>
              <Link href={{ pathname: '/provider/[slug]/stations', params: { slug: providerSlug } }} className="text-blue-500 hover:underline">
                {t('showAll')}
              </Link>
            </div>
            {stations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stations.map((station) => (
                  <div key={station.id} className="bg-muted p-4 rounded-lg shadow">
                    <h3 className="font-bold">{station.name}</h3>
                    <p className="text-sm text-muted-foreground">{station.address}</p>
                  </div>
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
              <p>{t('no_addons_available')}</p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
