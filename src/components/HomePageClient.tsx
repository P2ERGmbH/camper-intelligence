'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

interface HomePageClientProps {
  welcomeTitle: string;
  exploreCampersTitle: string;
  exploreCampersDescription: string;
  manageFleetTitle: string;
  manageFleetDescription: string;
}

export default function HomePageClient({ 
  welcomeTitle, 
  exploreCampersTitle, 
  exploreCampersDescription, 
  manageFleetTitle, 
  manageFleetDescription 
}: HomePageClientProps) {
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">{welcomeTitle}</h1>

      {/* Banner for User Area */}
      <Link href={`/${locale}/start`} className="block w-full max-w-md p-6 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 text-center">
        <h2 className="text-2xl font-semibold mb-2">{exploreCampersTitle}</h2>
        <p className="text-lg">{exploreCampersDescription}</p>
      </Link>

      {/* Banner for Provider Pages */}
      <Link href={`/${locale}/provider`} className="block w-full max-w-md p-6 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300 text-center">
        <h2 className="text-2xl font-semibold mb-2">{manageFleetTitle}</h2>
        <p className="text-lg">{manageFleetDescription}</p>
      </Link>
    </div>
  );
}
