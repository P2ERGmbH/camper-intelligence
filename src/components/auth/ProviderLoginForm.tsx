'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';

export default function ProviderLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const router = useRouter();
  const t = useTranslations('login');
  const locale = useLocale();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const endpoint = isRegisterMode ? `/${locale}/api/provider/register` : `/${locale}/api/provider/login`;
    const successMessage = isRegisterMode ? 'Provider registration successful:' : 'Provider login successful:';
    const failureMessage = isRegisterMode ? t('registration-failed') : t('login-failed');
    const redirectPath = `/${locale}/provider`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(successMessage, data.message);
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
        } else {
          router.push(redirectPath);
        }
      } else {
        setError(data.error || failureMessage);
      }
    } catch (err) {
      console.error('Error during provider operation:', err);
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
      <button
        type="submit"
        onClick={() => setIsRegisterMode(false)}
        className="bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 w-full"
      >
        {t('login-button')}
      </button>
      <button
        type="submit"
        onClick={() => setIsRegisterMode(true)}
        className="bg-gray-300 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-400 transition duration-300 ease-in-out transform hover:scale-105 w-full text-center"
      >
        {t('register-button')}
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