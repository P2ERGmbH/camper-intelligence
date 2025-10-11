'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';

interface AuthCheckerProps {
  children: React.ReactNode;
  locale: string;
}

export default function AuthChecker({ children, locale }: AuthCheckerProps) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`/${locale}/api/provider/whoami`);
        if (!res.ok) {
          router.push('/provider/login');
        }
      } catch (error) {
        console.error('Auth check failed', error);
        router.push('/provider/login');
      }
    };
    checkAuth();
  }, [router, locale]);

  return <>{children}</>;
}
