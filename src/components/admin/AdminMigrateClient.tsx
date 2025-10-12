'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';

interface AdminMigrateClientProps {
  initialMigrationStatus: string;
  initialMessage?: string;
  initialError?: string;
}

export default function AdminMigrateClient({ initialMigrationStatus, initialMessage = '', initialError = '' }: AdminMigrateClientProps) {
  const [migrationStatus, setMigrationStatus] = useState<string>(initialMigrationStatus);
  const [message, setMessage] = useState<string>(initialMessage);
  const [error, setError] = useState<string>(initialError);
  const locale = useLocale();

  const fetchMigrationStatus = useCallback(async () => {
    try {
      const response = await fetch(`/${locale}/api/admin/migrate`);
      const data = await response.json();
      if (response.ok) {
        setMigrationStatus(data.pendingMigrations > 0 
          ? `${data.pendingMigrations} pending migrations` 
          : 'No pending migrations');
      } else {
        setError(data.error || 'Failed to fetch migration status.');
      }
    } catch (err) {
      console.error('Error fetching migration status:', err);
      setError('An unexpected error occurred while fetching migration status.');
    }
  }, [locale]);

  useEffect(() => {
    fetchMigrationStatus();
  }, [fetchMigrationStatus]);

  const handleApplyMigrations = async () => {
    setMessage('');
    setError('');
    try {
      const response = await fetch(`/${locale}/api/admin/migrate`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        fetchMigrationStatus(); // Refresh status after applying
      } else {
        setError(data.error || 'Failed to apply migrations.');
      }
    } catch (err) {
      console.error('Error applying migrations:', err);
      setError('An unexpected error occurred while applying migrations.');
    }
  };

  return (
    <div>
      <h2 className="text-foreground">Database Migrations</h2>
      <p className="text-foreground">Current Status: {migrationStatus}</p>
      <button onClick={handleApplyMigrations} className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Apply Migrations</button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
