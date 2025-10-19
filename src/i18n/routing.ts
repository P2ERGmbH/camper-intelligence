import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';


export const routing = defineRouting({
    locales: ['en', 'de', 'fr'],
    defaultLocale: 'de',
    pathnames: {
        '/contact': '/contact',
        '/search': '/search',
        '/': '/',
        '/provider/login': '/provider/login',
        '/provider': '/provider',
        '/provider/dashboard': '/provider/dashboard',
        '/provider/add': '/provider/add',
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
        '/provider/[slug]/stations/[id]/edit': '/provider/[slug]/stations/[id]/edit',
        '/provider/[slug]/stations/import': '/provider/[slug]/stations/import',
        '/provider/[slug]/stations/import/api': '/provider/[slug]/stations/import/api',
        '/provider/[slug]/campers/[camperId]': '/provider/[slug]/campers/[camperId]',
        '/provider/[slug]/campers/[camperId]/edit': '/provider/[slug]/campers/[camperId]/edit',
        '/provider/dashboard/campers/[camperId]': '/provider/dashboard/campers/[camperId]',
        '/provider/dashboard/stations/[id]': '/provider/dashboard/stations/[id]',
        '/admin': '/admin',
        '/admin/login': '/admin/login',
        '/login/admin': '/login/admin',
        '/admin/providers': '/admin/providers',
        '/admin/providers/import': '/admin/providers/import',
        '/admin/import/providers/cu-camper': '/admin/import/providers/cu-camper',
        '/admin/import/campers/cu-camper': '/admin/import/campers/cu-camper',
        '/admin/import/campers/jucy': '/admin/import/campers/jucy',
        '/admin/import/stations/cu-camper': '/admin/import/stations/cu-camper',
        '/admin/import/stations/jucy': '/admin/import/stations/jucy',
        '/admin/campers': '/admin/campers',
        '/admin/stations': '/admin/stations',
        '/admin/import': '/admin/import',
        '/admin/import/jucy': '/admin/import/jucy',
        '/admin/migrate': '/admin/migrate',
    },
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
    createNavigation(routing);
