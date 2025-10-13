import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'de',
  pathnames: {
    '/': '/',
    '/provider': '/provider',
    '/login/provider': '/login/provider',
    '/provider/dashboard': '/provider/dashboard',
    '/provider/[slug]': '/provider/[slug]',
    '/provider/[slug]/campers': '/provider/[slug]/campers',
    '/provider/[slug]/campers/add': '/provider/[slug]/campers/add',
    '/provider/[slug]/addons': '/provider/[slug]/addons',
    '/provider/[slug]/stations': '/provider/[slug]/stations',
    '/provider/[slug]/stations/add': '/provider/[slug]/stations/add',
    '/provider/[slug]/legal': '/provider/[slug]/legal',
    '/provider/[slug]/users': '/provider/[slug]/users',
    '/provider/[slug]/campers/import': '/provider/[slug]/campers/import',
    '/provider/[slug]/stations/[id]': '/provider/[slug]/stations/[id]',
    '/provider/[slug]/stations/import': '/provider/[slug]/stations/import',
    '/provider/[slug]/stations/import/api': '/provider/[slug]/stations/import/api',
    '/provider/[slug]/campers/[id]': '/provider/[slug]/campers/[id]',
    '/provider/[slug]/campers/[id]/edit': '/provider/[slug]/campers/[id]/edit',
    '/admin': '/admin',
    '/admin/login': '/admin/login',
    '/login/admin': '/login/admin',
    '/admin/providers': '/admin/providers',
    '/admin/cu-camper-import/providers': '/admin/cu-camper-import/providers',
    '/admin/cu-camper-import/campers': '/admin/cu-camper-import/campers',
    '/admin/cu-camper-import/stations': '/admin/cu-camper-import/stations',
    '/admin/campers': '/admin/campers',
    '/admin/stations': '/admin/stations',
    '/admin/migrate': '/admin/migrate',
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
