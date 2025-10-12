import AdminLoginClient from '@/components/admin/AdminLoginClient';

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Admin Login' };
}

export default async function AdminLoginPage() {
  // No server-side data fetching for this page, as the client component handles it.
  // We can pass initial errors if needed, but for now, it starts clean.

  return (
    <AdminLoginClient />
  );
}
