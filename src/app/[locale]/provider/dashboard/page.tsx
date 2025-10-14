import { createDbConnection } from '@/lib/db/utils';
import { getAllProviders } from '@/lib/db/providers';
import { Provider } from '@/types/provider';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { generateProviderSlug } from '@/lib/utils/slug';

export async function generateMetadata() {
  const t = await getTranslations('dashboard');
  return { title: t('title') };
}

export default async function ProviderDashboardPage() {
  const connection = await createDbConnection();
  let providers: Provider[] = [];
  try {
    providers = await getAllProviders(connection);
  } catch (error) {
    console.error('Error fetching providers:', error);
  } finally {
    await connection.end();
  }

  const t = await getTranslations('dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-card shadow-lg rounded-lg p-8 border border-border">
          <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
          <div className="flex justify-end mb-4">
            <Link href="/provider/add" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              {t('addProviderButton')}
            </Link>
          </div>
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('availableProviders')}</h2>
          <ul>
            {providers.map((provider) => (
              <li key={provider.id} className="flex justify-between items-center text-lg py-2 border-b border-border last:border-b-0">
                <span>{provider.company_name} ({provider.company_name})</span>
                <Link href={{ pathname: '/provider/[slug]', params: { slug: generateProviderSlug(provider.company_name, provider.id) } }} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  {t('editButton')}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
