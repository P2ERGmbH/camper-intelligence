'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface ProviderUser {
  id: number;
  email: string;
  role: 'admin' | 'owner' | 'viewer' | 'editor';
}

export default function ProviderUserManagement() {
  const t = useTranslations('providerDashboard'); // Assuming a new translation namespace for provider dashboard specific texts
  const params = useParams();
  const slug = params.slug as string;
  const locale = params.locale as string;

  const [users, setUsers] = useState<ProviderUser[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/${locale}/api/provider/${slug}/users`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        setError(data.error || t('fetch_users_error'));
      }
    } catch (err) {
      console.error('Failed to fetch provider users:', err);
      setError(t('fetch_users_error'));
    } finally {
      setLoading(false);
    }
  }, [slug, locale, t]);

  useEffect(() => {
    fetchUsers();
  }, [slug, locale, fetchUsers]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/${locale}/api/provider/${slug}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || t('user_added_success'));
        setEmail('');
        setPassword('');
        setRole('viewer');
        fetchUsers(); // Refresh the user list
      } else {
        setError(data.error || t('user_add_error'));
      }
    } catch (err) {
      console.error('Failed to add provider user:', err);
      setError(t('user_add_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('manage_provider_users')}</h2>

      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">{t('add_new_user')}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">{t('email_label')}</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">{t('password_label')}</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-foreground">{t('role_label')}</label>
            <select
              id="role"
              className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground"
              value={role}
              onChange={(e) => setRole(e.target.value as 'viewer' | 'editor')}
            >
              <option value="viewer">{t('role_viewer')}</option>
              <option value="editor">{t('role_editor')}</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? t('adding_user') : t('add_user_button')}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">{t('existing_users')}</h3>
        {loading && <p>{t('loading_users')}</p>}
        {!loading && users.length === 0 && <p>{t('no_users_found')}</p>}
        {!loading && users.length > 0 && (
          <ul className="divide-y divide-border">
            {users.map((user) => (
              <li key={user.id} className="py-2 flex justify-between items-center">
                <span className="text-foreground">{user.email}</span>
                <span className="text-muted-foreground text-sm">{user.role}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
