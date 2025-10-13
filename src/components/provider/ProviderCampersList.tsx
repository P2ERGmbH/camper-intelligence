'use client';

import { Camper } from '@/types/camper';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface ProviderCampersListProps {
  initialCampers: Camper[];
  error: string | null;
  slug: string;
}

export default function ProviderCampersList({ initialCampers, error, slug }: ProviderCampersListProps) {
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
                <div key={camper.id} className="bg-muted p-4 rounded-lg shadow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold">{camper.name}</h3>
                    <p className="text-sm text-muted-foreground">{camper.description}</p>
                  </div>
                  <Link href={{ pathname: '/provider/[slug]/campers/[id]/edit', params: { slug: slug, id: camper.id } }} className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    {t('edit_camper')}
                  </Link>
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