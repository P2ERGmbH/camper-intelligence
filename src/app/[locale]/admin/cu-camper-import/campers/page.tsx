import AdminCUCamperImportCampersClient from '@/components/admin/AdminCUCamperImportCampersClient';

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Admin CU Camper Import Campers' };
}

export default async function CuCamperImportCampersPage() {
  // No server-side data fetching for this page, as the client component handles it.
  // We can pass initial messages/errors if needed, but for now, it starts clean.

  return (
    <AdminCUCamperImportCampersClient />
  );
}
