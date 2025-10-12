import { getPendingMigrationsCount } from '@/lib/db/migrations';
import AdminMigrateClient from '@/components/admin/AdminMigrateClient';

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Admin Database Migrations' };
}

export default async function AdminMigratePage() {
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
