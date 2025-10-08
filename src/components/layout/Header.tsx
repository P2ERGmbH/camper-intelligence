'use client';

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '../../i18n/routing';
import { useEffect, useState } from 'react';

export default function Header() {
  const t = useTranslations('provider');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/provider/whoami');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/provider/logout', { method: 'POST' });
      setUser(null);
      router.push('/provider/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Camper Intelligence</div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="hover:text-gray-200">{t('header-solutions')}</a>
          <a href="#" className="hover:text-gray-200">{t('header-pricing')}</a>
          <a href="#" className="hover:text-gray-200">{t('header-contact')}</a>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-500 px-6 py-2 rounded-full font-bold hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <Link href="/provider/login" className="bg-white text-blue-500 px-6 py-2 rounded-full font-bold hover:bg-gray-100">{t('header-login')}</Link>
          )}
        </nav>
      </header>
    </div>
  );
}
