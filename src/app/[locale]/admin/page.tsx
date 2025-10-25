import {getAuthenticatedUser} from "@/lib/auth";
import {Link, redirect} from "@/i18n/routing";
import {Metadata} from "next";
import Button from "@/components/inputs/Button";

export async function generateMetadata(): Promise<Metadata> {
    return {title: 'Camper Intelligence - Admin Dashboard'};
}

export default async function AdminDashboardPage({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    const user = await getAuthenticatedUser();

    if (!user || user.role !== 'admin') {
        redirect({href: '/admin/login', locale});
    }
    return (
        <div className={"flex flex-col max-w-xl justify-center-safe m-auto gap-2 py-4"}>
            <h2 className="text-foreground">Welcome to the Admin Dashboard</h2>
            <div className={"grid-cols-3 grid gap-2"}>
                <Link href={{pathname:'/admin/providers'}}><Button>Providers</Button></Link>
                <Link href={{pathname:'/admin/campers'}}><Button>Campers</Button></Link>
                <Link href={{pathname:'/admin/stations'}}><Button>Stations</Button></Link>
                <Link href={{pathname:'/admin/migrate'}}><Button>Migration</Button></Link>
                <Link href={{pathname:'/admin/import'}}><Button>Import</Button></Link>
            </div>
        </div>
    );
}
