'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

interface AdminLoginClientProps {
  initialError?: string;
}

export default function AdminLoginClient({ initialError = '' }: AdminLoginClientProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('login');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`/${locale}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Admin login successful:', data.message);
        router.push(`/${locale}/admin`); // Redirect to admin dashboard on success
      } else {
        setError(data.error || t('login-failed'));
      }
    } catch (err) {
      console.error('Error during admin login:', err);
      setError(t('unexpected-error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[32px] items-center w-full">
      <div className="flex flex-col gap-[8px] items-start w-full">
        <div className="bg-white rounded-[12px] w-full border-2 border-black">
          <div className="flex flex-row items-center w-full">
            <div className="flex gap-[8px] items-center px-[20px] py-[12px] w-full">
              <input
                type="email"
                placeholder={t('email-placeholder')}
                className="font-medium leading-[normal] text-[#6a7a8a] text-[16px] w-full focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[12px] w-full border-2 border-black">
          <div className="flex flex-row items-center w-full">
            <div className="flex gap-[8px] items-center px-[20px] py-[12px] w-full">
              <input
                type="password"
                placeholder={t('password-placeholder')}
                className="font-medium leading-[normal] text-[#6a7a8a] text-[16px] w-full focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <p className="font-medium leading-[normal] text-[#6a7a8a] text-[12px] w-full whitespace-pre-wrap">
          {t('verification-email-info')}
        </p>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 w-full">
        {t('login-button')}
      </button>
      <p className="font-bold leading-[normal] text-[16px] text-black text-center w-full whitespace-pre-wrap">
        {t('or')}
      </p>
      <div className="flex flex-col gap-[12px] items-start w-full">
        <button type="button" className="bg-white rounded-[12px] w-full border-2 border-[#b4bdc7] flex items-center justify-center px-[20px] py-[12px] gap-[8px]">
          <Image alt="Google" src="/assets/svg/google.svg" width={24} height={24} />
          <p className="font-bold leading-[1.1] text-[16px] text-black">
            {t('login-with-google')}
          </p>
        </button>
        <button type="button" className="bg-white rounded-[12px] w-full border-2 border-[#b4bdc7] flex items-center justify-center px-[20px] py-[12px] gap-[8px]">
          <Image alt="X" src="/assets/svg/x.svg" width={24} height={24} />
          <p className="font-bold leading-[1.1] text-[16px] text-black">
            {t('login-with-x')}
          </p>
        </button>
        <button type="button" className="bg-white rounded-[12px] w-full border-2 border-[#b4bdc7] flex items-center justify-center px-[20px] py-[12px] gap-[8px]">
          <Image alt="Facebook" src="/assets/svg/facebook.svg" width={24} height={24} />
          <p className="font-bold leading-[1.1] text-[16px] text-black">
            {t('login-with-facebook')}
          </p>
        </button>
      </div>
    </form>
  );
}
