import ProviderUserManagement from '@/components/provider/ProviderUserManagement';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const title = `Camper Intelligence - ${slug} Users`;
  return { title };
}

export default async function UsersPage() {
  return <ProviderUserManagement />;
}