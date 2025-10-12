import AdminImportProvidersClient from '@/components/admin/AdminImportProvidersClient';

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Admin Provider Import' };
}

export default async function AdminImportProvidersPage() {
  // No server-side data fetching for this page, as the client component handles it.
  // We can pass initial messages/errors if needed, but for now, it starts clean.

  return (
    <AdminImportProvidersClient />
  );
}
