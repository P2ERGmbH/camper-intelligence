import EditPageClient from './EditPageClient';
import {Metadata} from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = `Camper Intelligence - ${slug} Edit Information`;
  return { title };
}

export default async function EditPage() {
  return <EditPageClient />;
}
