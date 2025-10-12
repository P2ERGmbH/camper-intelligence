import AdminCUCamperImportStationsClient from '@/components/admin/AdminCUCamperImportStationsClient';

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Admin CU Camper Import Stations' };
}

export default async function CuCamperImportStationsPage() {
  // No server-side data fetching for this page, as the client component handles it.
  // We can pass initial messages/errors if needed, but for now, it starts clean.

  return (
    <AdminCUCamperImportStationsClient />
  );
}
