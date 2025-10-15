import { useTranslations } from 'next-intl';
import { AdminJucyUnifiedImportClient } from '@/components/admin/AdminJucyUnifiedImportClient';
import { Metadata } from 'next';
import {getTranslations} from "next-intl/server";

type Props = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'admin' });

  return {
    title: t('jucyUnifiedImportTitle'),
    description: t('jucyUnifiedImportDescription'),
  };
}

const JucyUnifiedImportPage = () => {
  const t = useTranslations('admin');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t('jucyUnifiedImportTitle')}</h1>
      <AdminJucyUnifiedImportClient />
    </div>
  );
};

export default JucyUnifiedImportPage;
