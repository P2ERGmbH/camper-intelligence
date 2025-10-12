'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';

interface AdminImportProvidersClientProps {
  initialMessage?: string;
  initialError?: string;
}

export default function AdminImportProvidersClient({ initialMessage = '', initialError = '' }: AdminImportProvidersClientProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>(initialMessage);
  const [error, setError] = useState<string>(initialError);
  const locale = useLocale();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setMessage('');
      setError('');
    }
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`/${locale}/api/admin/providers/import`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError('');
      } else {
        setError(data.error || 'Failed to import providers.');
        setMessage('');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('An unexpected error occurred.');
      setMessage('');
    }
  }, [selectedFile, locale]);

  return (
    <div>
      <h2 className="text-foreground">Import Providers</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} className="text-foreground bg-background border border-foreground p-2 rounded" />
        <button type="submit" disabled={!selectedFile} className="ml-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500">Upload CSV</button>
      </form>
      {message && <p className="text-green-500 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
