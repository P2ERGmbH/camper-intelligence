'use client';



import TabNavigation from '@/components/layout/TabNavigation';
import { Provider } from '@/types/provider';

interface ProviderOverviewClientProps {
  title: string;
  provider: Provider;
}

export default function ProviderOverviewClient({ title, provider }: ProviderOverviewClientProps) {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-card shadow-lg rounded-lg p-8 border border-border">
          <h1 className="text-3xl font-bold mb-6">{title}: {provider.company_name}</h1>
          <TabNavigation />
          {/* Display other provider details here */}
          <div className="mt-8">
            <p className="text-lg"><strong>External ID:</strong> {provider.ext_id}</p>
            <p className="text-lg"><strong>Email:</strong> {provider.email}</p>
            {/* Add more provider details as needed */}
          </div>
        </div>
      </main>
    </div>
  );
}
