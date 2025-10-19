import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: { camperId: string } }) {
  const { camperId } = params;
  const title = `Camper Intelligence - Camper Details: ${camperId}`;
  return { title };
}

export default function CamperDetailsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
