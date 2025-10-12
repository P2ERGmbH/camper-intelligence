import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const title = `Camper Intelligence - Camper Details: ${id}`;
  return { title };
}

export default function CamperDetailsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
