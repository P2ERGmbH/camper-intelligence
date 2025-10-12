import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const title = `Camper Intelligence - ${slug} Add Camper`;
  return { title };
}

export default function ProviderAddCamperLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
