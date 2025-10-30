import {getMessages, setRequestLocale} from 'next-intl/server';
import {NextIntlClientProvider} from "next-intl";
import AuthChecker from '@/components/auth/AuthChecker';
import {redirect, routing} from "@/i18n/routing";
import {notFound} from "next/navigation";
import {createDbConnection} from "@/lib/db/utils";
import {Provider} from "@/types/provider";
import {getProviderById} from "@/lib/db/providers";
import {Camper} from "@/types/camper";
import {Station} from "@/types/station";
import {Addon} from "@/types/addon";
import {getCampersByProviderIds} from "@/lib/db/campers";
import {getStationsByProviderIds} from "@/lib/db/stations";
import {getAddonsByProviderIds} from "@/lib/db/addons";
import {getProviderIdFromSlug} from "@/lib/utils/slug";
import {ProviderContextProvider} from "@/contexts/ProviderContext";
import SubHeader from "@/components/layout/SubHeader";
import {getAuthenticatedUser} from "@/lib/auth";
import {SubheaderProvider} from "@/components/layout/SubheaderContext"; // New client component for auth

export default async function ProviderSlugLayout({children, params}: {
    children: React.ReactNode;
    params: Promise<{ locale: string, slug: string }>
}) {
    const {locale, slug} = await params;

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

    const providerId = getProviderIdFromSlug(slug);
    if (providerId === null) {
        notFound();
    }

    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'admin') {
        redirect({href: '/provider/login', locale});
        return null;
    }

    const connection = await createDbConnection();
    let providers: Provider[] = [];
    let campers: Camper[] = [];
    let stations: Station[] = [];
    let addons: Addon[] = [];

    try {
        const provider = await getProviderById(connection, providerId);
        if (provider !== null) {
            providers = [provider];
            campers = await getCampersByProviderIds(connection, [provider.id]);
            stations = await getStationsByProviderIds(connection, [provider.id]);
            addons = await getAddonsByProviderIds(connection, [provider.id]);
        }
    } catch (error) {
        console.error('Error fetching provider data:', error);
    } finally {
        await connection.end();
    }

    return (
        <NextIntlClientProvider messages={messages}>
            <AuthChecker locale={locale}>
                <main className="bg-[#E8ECF3] dark:bg-[#141520]">
                    <ProviderContextProvider
                        initial={{
                            providers,
                            campers,
                            stations,
                            addons,
                            activeProviderId: providerId
                        }}>
                        <SubheaderProvider canEdit={user.role==='admin'}>
                            <SubHeader />
                            {children}
                        </SubheaderProvider>
                    </ProviderContextProvider>
                </main>
            </AuthChecker>
        </NextIntlClientProvider>
    );
}
