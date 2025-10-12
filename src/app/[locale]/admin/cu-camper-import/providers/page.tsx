import AdminCUCamperImportProvidersClient from '@/components/admin/AdminCUCamperImportProvidersClient';

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Admin CU Camper Import Providers' };
}

export default async function CuCamperImportProvidersPage() {
  // No server-side data fetching for this page, as the client component handles it.
  // We can pass initial messages/errors if needed, but for now, it starts clean.

  return (
    <AdminCUCamperImportProvidersClient />
  );
}
