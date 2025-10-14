import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const metadata = {
  title: 'Camper Intelligence',
};

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');

  const supportedLocales = routing.locales;
  const defaultLocale = routing.defaultLocale;

  let targetLocale = defaultLocale;

  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
    for (const lang of languages) {
      if (supportedLocales.includes(lang as (typeof supportedLocales)[number])) {
        targetLocale = lang as (typeof supportedLocales)[number];
        break;
      }
    }
  }

  redirect(`/${targetLocale}`);
}