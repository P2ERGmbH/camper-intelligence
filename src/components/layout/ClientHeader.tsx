'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function ClientHeader() {
  const t = useTranslations('clientHeader');
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  return (
    <div className="relative bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">{t('brandName')}</div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href={{ pathname: '/search' }} className="hover:text-gray-200">{t('search')}</Link>
          <Link href={{ pathname: '/provider' }} className="bg-white text-teal-500 px-6 py-2 rounded-full font-bold hover:bg-gray-100">{t('providerLogin')}</Link>
        </nav>
      </header>
    </div>
  );
}
