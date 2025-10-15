'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';

interface AdminCUCamperImportProvidersClientProps {
  initialMessage?: string;
  initialError?: string;
}

export default function AdminCUCamperImportProvidersClient({ initialMessage = '', initialError = '' }: AdminCUCamperImportProvidersClientProps) {
  const [message, setMessage] = useState<string>(initialMessage);
  const [error, setError] = useState<string>(initialError);
  const [loading, setLoading] = useState<boolean>(false);
  const locale = useLocale();

  const handleImport = useCallback(async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/${locale}/api/admin/import/providers/cu-camper`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message + (data.changes ? `\nChanges: ${data.changes.join('; ' )}` : ''));
      } else {
        setError(data.error || 'Failed to import providers.');
      }
    } catch (err) {
      console.error('Error during CU Camper provider import:', err);
      setError('An unexpected error occurred during import.');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Import CU Camper Providers</h2>
      <p className="mb-4 text-foreground">Click the button below to fetch and import provider data from the CU Camper API.</p>
      <button 
        onClick={handleImport} 
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-500 transition-colors"
      >
        {loading ? 'Importing...' : 'Import Providers'}
      </button>

      {message && <p className="text-green-600 mt-4 whitespace-pre-line">{message}</p>}
      {error && <p className="text-red-600 mt-4">Error: {error}</p>}
    </div>
  );
}
