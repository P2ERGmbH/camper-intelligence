import ProviderLoginForm from '@/components/auth/ProviderLoginForm';

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Provider Login' };
}

export default async function ProviderLoginPage() {
  // const { locale } = params; // Removed as locale is not used directly in this component

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <ProviderLoginForm />
    </div>
  );
}