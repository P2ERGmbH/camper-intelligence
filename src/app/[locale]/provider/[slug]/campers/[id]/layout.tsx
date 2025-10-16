import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: { slug: string, id: string } }) {
  const awaitedParams = await params;
  const { slug, id } = awaitedParams;
  const title = `Camper Intelligence - ${slug} Camper: ${id}`;
  return { title };
}

export default function ProviderCamperDetailsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
