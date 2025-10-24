import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Metadata} from 'next';
import {Link, redirect} from '@/i18n/routing';
import {getAuthenticatedUser} from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Camper Intelligence - Admin Imports & Migrations',
        description: 'Manage data imports and database migrations for the admin panel.',
    };
}

export async function generateStaticParams() {
    return [{locale: 'en'}, {locale: 'de'}, {locale: 'fr'}];
}

export default async function AdminImportPage({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    setRequestLocale(locale);

    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'admin') {
        redirect({href: '/admin/login', locale});
    }

    const t = await getTranslations('admin');

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6">{t('import-page-title')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Import Providers */}
          <Link href={{pathname: '/admin/import/providers/cu-camper'}}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            {t('import-providers-title')}
          </Link>

                {/* Import Campers */}
          <Link href={{pathname: '/admin/import/campers/cu-camper'}}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            {t('import-campers-title')}
          </Link>

                {/* Import Jucy Campers */}
          <Link href={{pathname: '/admin/import/campers/jucy'}}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            {t('import-jucy-campers-title')}
          </Link>

                {/* Import Stations */}
          <Link href={{pathname: '/admin/import/stations/cu-camper'}}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            {t('import-stations-title')}
          </Link>

                {/* Import Jucy Stations */}
          <Link href={{pathname: '/admin/import/stations/jucy'}}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            {t('import-jucy-stations-title')}
          </Link>

                {/* Jucy Unified Import */}
          <Link href={{pathname: '/admin/import/jucy'}}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            {t('jucyUnifiedImportTitle')}
          </Link>



                {/* Database Migrations */}
                <Link href={{pathname: '/admin/migrate'}}
                      className="block p-6 bg-card rounded-lg shadow hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">{t('migrate-title')}</h2>
                    <p className="text-muted-foreground">{t('migrate-description')}</p>
                </Link>
            </div>
        </div>
    );
}
