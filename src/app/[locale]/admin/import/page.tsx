import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/routing';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Camper Intelligence - Admin Imports & Migrations',
    description: 'Manage data imports and database migrations for the admin panel.',
  };
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }, { locale: 'fr' }];
}

export default async function AdminImportPage() {
  const t = await getTranslations('admin');

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">{t('import-page-title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Import Providers */}
        <Link href={{ pathname: '/admin/cu-camper-import/providers' }} className="block p-6 bg-card rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">{t('import-providers-title')}</h2>
          <p className="text-muted-foreground">{t('import-providers-description')}</p>
        </Link>

        {/* Import Campers */}
        <Link href={{ pathname: '/admin/cu-camper-import/campers' }} className="block p-6 bg-card rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">{t('import-campers-title')}</h2>
          <p className="text-muted-foreground">{t('import-campers-description')}</p>
        </Link>

        {/* Import Stations */}
        <Link href={{ pathname: '/admin/cu-camper-import/stations' }} className="block p-6 bg-card rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">{t('import-stations-title')}</h2>
          <p className="text-muted-foreground">{t('import-stations-description')}</p>
        </Link>

        {/* Database Migrations */}
        <Link href={{ pathname: '/admin/migrate' }} className="block p-6 bg-card rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">{t('migrate-title')}</h2>
          <p className="text-muted-foreground">{t('migrate-description')}</p>
        </Link>
      </div>
    </div>
  );
}
