import {ReactNode} from 'react';
import {setRequestLocale} from 'next-intl/server';
import {createDbConnection} from "@/lib/db/utils";
import {Provider} from "@/types/provider";
import {Camper} from "@/types/camper";
import {Station} from "@/types/station";
import {getAllProviders} from "@/lib/db/providers";
import {getAllCampers} from "@/lib/db/campers";
import {getAllStations} from "@/lib/db/stations";
import AuthChecker from "@/components/auth/AuthChecker";
import {ProviderContextProvider} from "@/contexts/ProviderContext";
import SubHeader from "@/components/layout/SubHeader";
import {SubheaderProvider} from "@/components/layout/SubheaderContext";

interface AdminLayoutProps {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function AdminLayout({children, params}: AdminLayoutProps) {
    const {locale} = await params;
    setRequestLocale(locale);

    const connection = await createDbConnection();
    let providers: Provider[] = [];
    let campers: Camper[] = [];
    let stations: Station[] = [];

    try {
        providers = await getAllProviders(connection);
            campers = await getAllCampers(connection);
            stations = await getAllStations(connection);
    } catch (error) {
        console.error('Error fetching provider data:', error);
    } finally {
        await connection.end();
    }

    return (
        <AuthChecker locale={locale}>
            <main className="dark:bg-gray-900">
                <ProviderContextProvider
                    initial={{
                        providers,
                        campers,
                        stations,
                    }}>
                    <SubheaderProvider canEdit={true}>
                        <SubHeader />
                        {children}
                    </SubheaderProvider>
                </ProviderContextProvider>
            </main>
        </AuthChecker>
    );
}
