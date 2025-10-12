import { getTranslations } from 'next-intl/server';
import HomePageClient from '@/components/HomePageClient';

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Home' };
}

export default async function Home() {
  const t = await getTranslations('dashboard'); // Using dashboard namespace for generic text if not a dedicated home page namespace

  return (
    <HomePageClient
      welcomeTitle={t('welcome-title' || 'Welcome to Camper Intelligence')}
      exploreCampersTitle={t('explore-campers-title' || 'Explore Campers')}
      exploreCampersDescription={t('explore-campers-description' || 'Find and book your perfect camper for your next adventure.')}
      manageFleetTitle={t('manage-fleet-title' || 'Manage Your Fleet')}
      manageFleetDescription={t('manage-fleet-description' || 'Providers: Manage your campers, stations, and bookings.')}
    />
  );
}
