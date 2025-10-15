import AdminJucyImportStationsClient from '@/components/admin/AdminJucyImportStationsClient';
import {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import {getAuthenticatedUser} from "@/lib/auth";
import {redirect} from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Camper Intelligence - Admin Jucy Import Stations' };
}

export default async function JucyImportStationsPage({params}: { params: Promise<{ locale: string }> }) {
  const {locale} = await params;
  setRequestLocale(locale);

  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    redirect({href: '/admin/login', locale});
  }

  return (
    <AdminJucyImportStationsClient />
  );
}
