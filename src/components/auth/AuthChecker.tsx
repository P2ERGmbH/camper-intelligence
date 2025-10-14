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
        console.log('AuthChecker: whoami API response status:', res.status);
        const data = await res.json();
        console.log('AuthChecker: whoami API response data:', data);

        const shouldRedirect = !res.ok || (!data.user.providerRole && data.user.role !== 'admin') || (data.user.providerRole && !['admin', 'owner', 'viewer', 'editor'].includes(data.user.providerRole));
        console.log('AuthChecker: Should redirect:', shouldRedirect);

        if (shouldRedirect) {
          router.push(`/provider/login`);
        }
      } catch (error) {
        console.error('Auth check failed', error);
        router.push(`/provider/login`);
      }
    };
    checkAuth();
  }, [router, locale]);

  return <>{children}</>;
}
