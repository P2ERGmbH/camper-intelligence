import ProviderLoginForm from '@/components/auth/ProviderLoginForm';

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Provider Login' };
}

export default async function ProviderLoginPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <ProviderLoginForm locale={locale} />
    </div>
  );
}