'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('provider');

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 text-center">
        <p>{t('footer-copyright')}</p>
      </div>
    </footer>
  );
}
