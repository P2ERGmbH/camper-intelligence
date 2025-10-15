import AdminCUCamperImportStationsClient from '@/components/admin/AdminCUCamperImportStationsClient';
import {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import {getAuthenticatedUser} from "@/lib/auth";
import {redirect} from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Camper Intelligence - Admin CU Camper Import Stations' };
}

export default async function CuCamperImportStationsPage({params}: { params: Promise<{ locale: string }> }) {
  const {locale} = await params;
  setRequestLocale(locale);

  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    redirect({href: '/admin/login', locale});
  }
  // No server-side data fetching for this page, as the client component handles it.
  // We can pass initial messages/errors if needed, but for now, it starts clean.

  return (
    <AdminCUCamperImportStationsClient />
  );
}
