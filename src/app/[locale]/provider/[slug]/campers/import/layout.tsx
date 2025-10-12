import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const title = `Camper Intelligence - ${slug} Import Campers`;
  return { title };
}

export default function ProviderImportCampersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
