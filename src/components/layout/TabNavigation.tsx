'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';

type Tab = 'campers' | 'addons' | 'stations' | 'legal' | 'users';

export default function TabNavigation() {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug as string;
  const locale = params.locale as string;

  const getTabClass = (tab: Tab) => {
    const isActive = pathname.includes(`/${locale}/provider/${slug}/${tab}`);
    return isActive
      ? 'border-primary text-primary'
      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border';
  };

  return (
    <div className="border-b border-border">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <Link
          href={{ pathname: '/provider/[slug]/campers', params: { slug } }}
          className={`${getTabClass('campers')} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {t('navigation-campers')}
        </Link>
        <Link
          href={{ pathname: '/provider/[slug]/addons', params: { slug } }}
          className={`${getTabClass('addons')} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {t('navigation-addons')}
        </Link>
        <Link
          href={{ pathname: '/provider/[slug]/stations', params: { slug } }}
          className={`${getTabClass('stations')} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {t('navigation-stations')}
        </Link>
        <Link
          href={{ pathname: '/provider/[slug]/legal', params: { slug } }}
          className={`${getTabClass('legal')} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {t('navigation-legal')}
        </Link>
        <Link
          href={{ pathname: '/provider/[slug]/users', params: { slug } }}
          className={`${getTabClass('users')} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {t('navigation-users')}
        </Link>
      </nav>
    </div>
  );
}
