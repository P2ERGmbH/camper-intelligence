import {createDbConnection} from '@/lib/db/utils';
import {getAllProviders} from '@/lib/db/providers';
import {Provider} from '@/types/provider';
import {Link} from '@/i18n/routing';
import {getTranslations} from 'next-intl/server';
import {Metadata} from "next";
import SearchResultsList from "@/components/search/SearchResultsList";
import Button from "@/components/inputs/Button";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard');
    return {title: t('title')};
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
            <main className="flex flex-col flex-grow container mx-auto px-6 py-12 gap-6">
                <div className="bg-white dark:bg-[#13142a] rounded-4xl p-7">
                    <h2 className="text-3xl font-bold mb-6">Admin-Dashboard</h2>
                    <div className={"grid-cols-3 grid gap-2"}>
                        <Link href={{pathname:'/admin/providers'}}><Button>Providers</Button></Link>
                        <Link href={{pathname:'/admin/campers'}}><Button>Campers</Button></Link>
                        <Link href={{pathname:'/admin/stations'}}><Button>Stations</Button></Link>
                        <Link href={{pathname:'/admin/migrate'}}><Button>Migration</Button></Link>
                        <Link href={{pathname:'/admin/import'}}><Button>Import</Button></Link>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#13142a] rounded-4xl p-7">
                    <h2 className="text-3xl font-bold mb-6">{t('title')}</h2>
                    <div className={"grid-cols-3 grid gap-2"}>
                        <Link href={{pathname:'/provider'}}><Button>Providers</Button></Link>
                        <Link href={{pathname:'/provider/add'}}><Button>{t('addProviderButton')}</Button></Link>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#13142a] rounded-4xl p-7">
                    <h2 className="text-2xl font-bold mt-8 mb-4">{t('availableProviders')}</h2>
                    <SearchResultsList providers={providers}/>
                </div>
            </main>
        </div>
    );
}
