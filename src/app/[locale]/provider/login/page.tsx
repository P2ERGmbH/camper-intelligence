import Image from 'next/image';
import { Metadata } from 'next';
import ProviderLoginForm from '@/components/auth/ProviderLoginForm';
import { Suspense } from 'react';
import Loading from '@/components/Loading';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Camper Intelligence - Provider Login',
    description: 'Login page for providers',
  };
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }, { locale: 'fr' }];
}

export default async function ProviderLoginPage() {
  const t = await getTranslations('login');

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center">
      {/* Background Images */}
      <div className="absolute top-[10%] left-[10%] h-[80%] w-[80%] rotate-[295.937deg]">
        <Image alt="" src="/assets/svg/login-blur.svg" layout="fill" className="object-contain" />
      </div>
      <div className="absolute top-[460.57px] left-[180.39px] h-[336.854px] w-[418.614px]">
        <Image alt="" src="/assets/svg/login-hand.svg" layout="fill" className="object-contain" />
      </div>

      {/* Login Content */}
      <div className="relative z-10 flex flex-col items-center gap-[40px] max-w-[578px] p-8">
        <div className="w-full text-center">
          <h1 className="text-[40px] font-extrabold text-black dark:text-white mb-2">{t('title')}</h1>
          <p className="text-[28px] font-semibold text-black dark:text-white">
            {t('welcome-message')}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-[24px] rounded-[32px] shadow-md max-w-[412px] border border-[#e7e7e7] dark:border-gray-700">
          <Suspense fallback={<Loading />}>
            <ProviderLoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
