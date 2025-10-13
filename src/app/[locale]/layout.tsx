import { ReactNode } from 'react';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";

import Footer from '@/components/layout/Footer';
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Camper Intelligence",
  description: "Camper Intelligence - Your ultimate camper rental solution.",
};

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  let messages = {};
  try {
    messages = await getMessages();
  } catch (e) {
    console.warn('Could not load static translations', e);
  }

  return (
    <html lang={locale || "en"}>
      <body
        className={`dark:bg-gray-900 ${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
