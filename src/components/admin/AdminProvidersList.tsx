'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';

interface Provider {
  id: number;
  company_name: string;
  address: string;
  email: string;
  website: string;
}

interface AdminProvidersListProps {
  initialProviders: Provider[];
  error: string | null;
}

// Helper function to generate the slug
const generateProviderSlug = (companyName: string, id: number): string => {
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
  return `${slug}-${id}`;
};

export default function AdminProvidersList({ initialProviders, error: serverError }: AdminProvidersListProps) {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(serverError);
  const locale = useLocale();

  // Client-side re-fetching if needed, e.g., after an action
  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/${locale}/api/admin/providers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Provider[] = await response.json();
      setProviders(data);
    } catch (err) {
      console.error('Failed to fetch providers:', err);
      setError('Failed to load providers.');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Optional: re-fetch on mount if initial data is empty or an error occurred on server
  useEffect(() => {
    if (initialProviders.length === 0 && !serverError) {
      fetchProviders();
    }
  }, [initialProviders, serverError, fetchProviders]);

  if (loading) {
    return <p className="text-foreground">Loading providers...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Provider Management</h2>
      <Link href={{ pathname: '/admin/providers/import' }} className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4">
        Import Providers
      </Link>

      {providers.length === 0 ? (
        <p className="text-foreground">No providers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border border-foreground">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-foreground text-foreground">ID</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Company Name</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Address</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Email</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Website</th>
                <th className="py-2 px-4 border-b border-foreground text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{provider.id}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{provider.company_name}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{provider.address}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{provider.email}</td>
                  <td className="py-2 px-4 border-b border-foreground text-foreground">{provider.website}</td>
                  <td className="py-2 px-4 border-b">
                    <Link 
                      href={{ pathname: '/provider/[slug]', params: { slug: generateProviderSlug(provider.company_name, provider.id) } }}
                      className="text-blue-400 hover:underline"
                    >
                      View Dashboard
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
