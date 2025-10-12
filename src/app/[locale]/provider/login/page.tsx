'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';


import RegisterForm from '@/components/auth/RegisterForm';
import {useParams} from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = useTranslations('login');
  const router = useRouter();

  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/${locale}/api/provider/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'An error occurred');
      } else {
        router.push({pathname:'/provider/dashboard'});
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">

      <main className="flex-grow container mx-auto px-6 py-24 flex items-start justify-center space-x-8">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-gray-200">
          <h1 className="text-3xl font-bold text-center mb-6">{t('title')}</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email-login" className="block text-gray-700 text-sm font-bold mb-2">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                id="email-login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password-login" className="block text-gray-700 text-sm font-bold mb-2">
                {t('passwordLabel')}
              </label>
              <input
                type="password"
                id="password-login"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300"
                disabled={loading}
              >
                {loading ? 'Signing in...' : t('signInButton')}
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">{t('or')}</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center border border-gray-300 transition duration-300"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.657-3.657-11.303-8H6.393c1.651,6.343,7.421,11,14.607,11H24z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.591,44,30.035,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
            {t('sso')}
          </button>
        </div>
        <RegisterForm />
      </main>

    </div>
  );
}
