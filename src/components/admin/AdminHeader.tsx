'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useState, useEffect } from 'react';

interface User {
  name: string;
}

export default function AdminHeader() {
  const t = useTranslations('admin');
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setUser({ name: 'Admin User' });
  }, []);

  const handleLogout = async () => {
    try {
      setUser(null);
      router.push('/admin/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={'dark:bg-gray-900 relative pt-6 px-6'}>
      <div
        className="relative bg-[#212229] flex items-center justify-between px-6 py-4 md:px-14 md:py-6 rounded-2xl">
        {/* Logo */}
        <div className="flex items-center gap-1 text-white text-2xl">
          <p className="font-normal">camper</p>
          <p className="font-extrabold italic">intelligence</p>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex flex-1 justify-center gap-12 text-white text-base font-bold">
          <Link href={{ pathname: '/admin/providers' }} className="hover:text-gray-300">{t('header-providers')}</Link>
          <Link href={{ pathname: '/admin/campers' }} className="hover:text-gray-300">{t('header-campers')}</Link>
          <Link href={{ pathname: '/admin/stations' }} className="hover:text-gray-300">{t('header-stations')}</Link>
          <Link href={{ pathname: '/admin/import' }} className="hover:text-gray-300">{t('header-import')}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <button
              onClick={handleLogout}
              className="hidden md:block px-6 py-2 rounded-md text-black text-base font-bold"
              style={{ backgroundImage: "linear-gradient(163.7419779612836deg, rgba(86, 222, 239, 1) 11.291%, rgba(72, 152, 227, 1) 79.198%, rgba(254, 199, 169, 1) 154.12%), linear-gradient(90deg, rgba(174, 230, 246, 1) 0%, rgba(174, 230, 246, 1) 100%)"}}>
              {t('header-logout')}
            </button>
          ) : (
            <Link href={{ pathname: '/admin/login' }} className="hidden md:block px-6 py-2 rounded-md text-black text-base font-bold"
                  style={{ backgroundImage: "linear-gradient(163.7419779612836deg, rgba(86, 222, 239, 1) 11.291%, rgba(72, 152, 227, 1) 79.198%, rgba(254, 199, 169, 1) 154.12%), linear-gradient(90deg, rgba(174, 230, 246, 1) 0%, rgba(174, 230, 246, 1) 100%)"}}>
              {t('header-login')}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} className="md:hidden text-white">
            <Image src="/assets/svg/menu.svg" alt="Menu" width={24} height={24}/>
          </button>

          {/* Icons (always visible) */}
          <div className="hidden md:flex items-center gap-6">
            <Image src="/assets/svg/language.svg" alt="Language" width={24} height={24}/>
            <Image src="/assets/svg/user.svg" alt="User" width={24} height={24}/>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#212229] text-white p-6 rounded-b-2xl shadow-lg">
          <nav className="flex flex-col gap-4 text-base font-bold">
            <Link href={{ pathname: '/admin/providers' }} className="hover:text-gray-300" onClick={toggleMenu}>{t('header-providers')}</Link>
            <Link href={{ pathname: '/admin/campers' }} className="hover:text-gray-300" onClick={toggleMenu}>{t('header-campers')}</Link>
            <Link href={{ pathname: '/admin/stations' }} className="hover:text-gray-300" onClick={toggleMenu}>{t('header-stations')}</Link>
            <Link href={{ pathname: '/admin/import' }} className="hover:text-gray-300" onClick={toggleMenu}>{t('header-import')}</Link>
            {user ? (
              <button onClick={() => { handleLogout(); toggleMenu(); }} className="text-left hover:text-gray-300">{t('header-logout')}</button>
            ) : (
              <Link href={{ pathname: '/admin/login' }} className="hover:text-gray-300" onClick={toggleMenu}>{t('header-login')}</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
