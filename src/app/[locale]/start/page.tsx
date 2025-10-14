import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  return { title: 'Camper Intelligence - Get Started' };
}

export default async function StartPage() {
  const t = await getTranslations('dashboard'); // Using dashboard namespace for generic text if not a dedicated start page namespace

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-foreground">{t('start-page-title')}</h1>

      {/* Search Field Placeholder */}
      <div className="p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{t('search-campers-stations-title')}</h2>
        {/* TODO: Implement actual search component here */}
        <input 
          type="text" 
          placeholder={t('search-placeholder')}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="mt-4 w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors">{t('search-button')}</button>
      </div>

      {/* Camper List Placeholder */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('available-campers-title')}</h2>
        {/* TODO: Implement actual camper list component here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg shadow-md text-foreground">Camper Item 1</div>
          <div className="p-4 rounded-lg shadow-md text-foreground">Camper Item 2</div>
          <div className="p-4 rounded-lg shadow-md text-foreground">Camper Item 3</div>
        </div>
      </div>

      {/* Station List Placeholder */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('pickup-stations-title')}</h2>
        {/* TODO: Implement actual station list component here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg shadow-md text-foreground">Station Item 1</div>
          <div className="p-4 rounded-lg shadow-md text-foreground">Station Item 2</div>
          <div className="p-4 rounded-lg shadow-md text-foreground">Station Item 3</div>
        </div>
      </div>
    </div>
  );
}