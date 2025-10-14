import {getAuthenticatedUser} from "@/lib/auth";
import {redirect} from "@/i18n/routing";
import {Metadata} from "next";

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
        <div>
            <h2 className="text-foreground">Welcome to the Admin Dashboard</h2>
            <p className="text-foreground">Use the navigation above to manage providers, campers, and stations.</p>
        </div>
    );
}
