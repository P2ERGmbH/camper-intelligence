'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

type Tab = 'campers' | 'addons' | 'stations' | 'legal' | 'import';

export default function TabNavigation() {
  const t = useTranslations('dashboard');
  const pathname = usePathname();

  const getTabClass = (tab: Tab) => {
    const isActive = pathname.includes(`/dashboard/${tab}`);
    return isActive
      ? 'border-indigo-500 text-indigo-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <Link
          href="/provider/dashboard/campers"
          className={`${getTabClass('campers')} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {t('navigation-campers')}
        </Link>
        <Link
          href="/provider/dashboard/addons"
          className={`${getTabClass('addons')} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {t('navigation-addons')}
        </Link>
        <Link
          href="/provider/dashboard/stations"
          className={`${getTabClass('stations')} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {t('navigation-stations')}
        </Link>
        <Link
          href="/provider/dashboard/legal"
          className={`${getTabClass('legal')} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {t('navigation-legal')}
        </Link>
         <Link
          href="/provider/dashboard/import"
          className={`${getTabClass('import')} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {t('campers-import_new')}
        </Link>
      </nav>
    </div>
  );
}
