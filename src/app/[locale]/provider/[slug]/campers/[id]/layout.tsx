import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: { slug: string, id: string } }) {
  const { slug, id } = params;
  const title = `Camper Intelligence - ${slug} Camper: ${id}`;
  return { title };
}

export default function ProviderCamperDetailsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
