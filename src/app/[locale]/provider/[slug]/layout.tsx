import {getMessages, setRequestLocale} from 'next-intl/server';
import {NextIntlClientProvider} from "next-intl";
import AuthChecker from '@/components/auth/AuthChecker';
import {routing} from "@/i18n/routing";
import {notFound} from "next/navigation"; // New client component for auth

export default async function ProviderSlugLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string, slug: string }> }) {
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
      <AuthChecker locale={locale}>
          <main className="dark:bg-gray-900">
            {children}
          </main>
      </AuthChecker>
    </NextIntlClientProvider>
  );
}
