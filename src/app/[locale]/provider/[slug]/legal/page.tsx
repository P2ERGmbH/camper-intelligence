import { createDbConnection } from '@/lib/db/utils';
import { getProviderByExtId } from '@/lib/db/providers';
import LegalPageClient from './LegalPageClient';
import { notFound } from 'next/navigation';
import { Provider } from '@/types/provider';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = `Camper Intelligence - ${slug} Legal Information`;
  return { title };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const connection = await createDbConnection();
  let provider: Provider | null = null;
  try {
    provider = await getProviderByExtId(connection, slug);
  } catch (error) {
    console.error('Error fetching provider:', error);
  } finally {
    await connection.end();
  }

  if (!provider) {
    notFound();
  }

  return <LegalPageClient provider={provider} />;
}
