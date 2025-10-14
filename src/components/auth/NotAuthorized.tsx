'use client';

import { Link } from '@/i18n/routing';

export default function NotAuthorized() {

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="text-lg mb-8">You do not have permission to view this page.</p>
      <Link href={{ pathname: '/admin/login' }} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
        Go to Admin Login
      </Link>
    </div>
  );
}
