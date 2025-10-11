import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'de',
  pathnames: {
    '/': '/',
    '/provider': '/provider',
    '/provider/login': '/provider/login',
    '/provider/dashboard': '/provider/dashboard',
    '/provider/dashboard/campers': '/provider/dashboard/campers',
    '/provider/dashboard/campers/add': '/provider/dashboard/campers/add',
    '/provider/dashboard/addons': '/provider/dashboard/addons',
    '/provider/dashboard/stations': '/provider/dashboard/stations',
    '/provider/dashboard/stations/add': '/provider/dashboard/stations/add',
    '/provider/dashboard/legal': '/provider/dashboard/legal',
    '/provider/dashboard/campers/import': '/provider/dashboard/campers/import',
    '/provider/dashboard/stations/import': '/provider/dashboard/stations/import',
    '/provider/dashboard/stations/import/api': '/provider/dashboard/stations/import/api',
    '/provider/dashboard/stations/[id]': '/provider/dashboard/stations/[id]',
    '/provider/dashboard/campers/[id]': '/provider/dashboard/campers/[id]',
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
