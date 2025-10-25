import AuthChecker from "@/components/auth/AuthChecker";
import {ProviderContextProvider} from "@/contexts/ProviderContext";
import SubHeader from "@/components/layout/SubHeader";
import {NextIntlClientProvider} from "next-intl";
import { createDbConnection } from '@/lib/db/utils';
import {getAllProviders, getProvidersByUserId} from '@/lib/db/providers';
import { Provider } from '@/types/provider';
import {Link, redirect, routing} from '@/i18n/routing';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {generateProviderSlug} from '@/lib/utils/slug';
import {Metadata} from "next";
import {notFound} from "next/navigation";
import {Camper} from "@/types/camper";
import {Station} from "@/types/station";
import {Addon} from "@/types/addon";
import {getAllCampers, getCampersByProviderIds} from "@/lib/db/campers";
import {getAllStations, getStationsByProviderIds} from "@/lib/db/stations";
import {getAddonsByProviderIds} from "@/lib/db/addons";
import {getAuthenticatedUser} from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard');
    return { title: t('title') };
}

export default async function ProviderDashboardPage({params}: { params: Promise<{ locale: string }>}) {
    const {locale} = await params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);
    let messages = {};
    try {
        messages = await getMessages();
    } catch (e) {
        console.warn('Could not load static translations', e);
    }

    const connection = await createDbConnection();
    let providers: Provider[] = [];
    let campers: Camper[] = [];
    let stations: Station[] = [];
    let addons: Addon[] = [];

    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'admin') {
        redirect({href: '/provider/login', locale});
        return null;
    }

    try {
        if (user?.role === 'admin') {
            providers = await getAllProviders(connection);
            campers = await getAllCampers(connection);
            stations = await getAllStations(connection);
        } else {
                providers = await getProvidersByUserId(connection, user.id);
                const providerIds = providers.map(({id})=> id)
                campers = await getCampersByProviderIds(connection, providerIds);
                stations = await getStationsByProviderIds(connection, providerIds);
                addons = await getAddonsByProviderIds(connection, providerIds);
        }
    } catch (error) {
        console.error('Error fetching provider data:', error);
    } finally {
        await connection.end();
    }

    const t = await getTranslations('dashboard');

    return (
        <NextIntlClientProvider messages={messages}>
            <AuthChecker locale={locale}>
                <main className="dark:bg-gray-900">
                    <ProviderContextProvider
                        initial={{
                            providers,
                            campers,
                            stations,
                            addons,
                        }}>
                        <SubHeader/>
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
                    </ProviderContextProvider>
                </main>
            </AuthChecker>
        </NextIntlClientProvider>
    );
}
