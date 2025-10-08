import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'de',
  pathnames: {
    '/': '/',
    '/provider': '/provider',
    '/provider/login': '/provider/login',
    '/provider/dashboard/campers': '/provider/dashboard/campers',
    '/provider/dashboard/addons': '/provider/dashboard/addons',
    '/provider/dashboard/stations': '/provider/dashboard/stations',
    '/provider/dashboard/legal': '/provider/dashboard/legal',
    '/provider/dashboard/import': '/provider/dashboard/import',
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
