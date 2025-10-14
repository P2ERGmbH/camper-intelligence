import { getPendingMigrationsCount } from '@/lib/db/migrations';
import AdminMigrateClient from '@/components/admin/AdminMigrateClient';
import {getAuthenticatedUser} from "@/lib/auth";
import {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import {redirect} from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Camper Intelligence - Admin Database Migrations' };
}

export default async function AdminMigratePage({params}: { params: Promise<{ locale: string }> }) {
  const {locale} = await params;
  setRequestLocale(locale);

  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    redirect({href: '/admin/login', locale});
  }
  let initialMigrationStatus: string = 'Loading...';
  let initialError: string | null = null;

  try {
    const pendingMigrations = await getPendingMigrationsCount();
    initialMigrationStatus = pendingMigrations > 0 
      ? `${pendingMigrations} pending migrations` 
      : 'No pending migrations';
  } catch (err) {
    console.error('Error fetching initial migration status on server:', err);
    initialError = 'An unexpected error occurred while fetching initial migration status.';
  }

  return (
    <AdminMigrateClient initialMigrationStatus={initialMigrationStatus} initialError={initialError} />
  );
}
