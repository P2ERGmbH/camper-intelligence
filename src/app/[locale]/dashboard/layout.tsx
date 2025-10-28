import { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import SubHeader from "@/components/layout/SubHeader";
import { ProviderContextProvider } from '@/contexts/ProviderContext';
import {createDbConnection} from "@/lib/db/utils";
import {Provider} from "@/types/provider";
import {getAllProviders} from "@/lib/db/providers";
import {SubheaderProvider} from "@/components/layout/SubheaderContext";

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

    const connection = await createDbConnection();
    let providers: Provider[] = [];
    try {
        providers = await getAllProviders(connection);
    } catch (error) {
        console.error('Error fetching providers:', error);
    } finally {
        await connection.end();
    }

  return (
    <ProviderContextProvider initial={{providers}}>
        <SubheaderProvider>
            <SubHeader />
        </SubheaderProvider>
      {children}
    </ProviderContextProvider>
  );
}
