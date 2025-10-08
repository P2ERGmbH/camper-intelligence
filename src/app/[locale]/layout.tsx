import {NextIntlClientProvider} from 'next-intl';
import {
  getMessages,
  setRequestLocale,
} from 'next-intl/server';
import {routing} from "@/i18n/routing";
import {notFound} from "next/navigation";
 
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);
  let messages = {};
  try {
    messages = await getMessages();
  } catch (e) {
    console.warn('Could not load static translations', e);
  }

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}