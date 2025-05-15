import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Users, User, Building2, MapPin, Library, Book, Handshake, Calendar, Clock, ChartNoAxesCombined } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import CardFlip from "@/components/ui/card-flip";
import { Icon } from '@/components/icon';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface PageProps {
    auth: {
        user: any,
        permissions: string[],
    }
}

export default function Dashboard() {
    const page = usePage<{ props: PageProps }>();
    const auth = page.props.auth;

    console.log(auth.permissions);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                {auth.permissions.includes('users.view') ? (
                    <DashboardCard
                        title="Usuarios"
                        description="Gestiona los usuarios del sistema"
                        href="/users"
                        icon={Users}
                    />
                ) : (
                    ""
                )}

                {/* <CardFlip
                    contentFront={
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <Icon iconNode={User} className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Usuario 1</h3>
                                <p className="text-sm text-muted-foreground">descripcion de usuario</p>
                            </div>
                        </div>
                    }
                    contentBack={
                        <div className="flex w-full h-full items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <Icon iconNode={User} className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">cliente 2</h3>
                                <p className="text-sm text-muted-foreground">descripcion de cliente</p>
                            </div>
                        </div>
                    }
                /> */}

                {auth.permissions.includes("report.view") && auth.permissions.includes("report.print") ? (
                    <DashboardCard
                        title="Pisos"
                        description="Gestiona los pisos de la biblioteca"
                        href="/floors"
                        icon={Building2}
                    />
                ) : (
                    ""
                )}

                {auth.permissions.includes("report.view") && auth.permissions.includes("report.print") ? (
                    <DashboardCard
                        title="Zonas"
                        description="Gestiona las zonas de la biblioteca"
                        href="/zones"
                        icon={MapPin}
                    />
                ) : (
                    ""
                )}

                {auth.permissions.includes("report.view") && auth.permissions.includes("report.print") ? (
                    <DashboardCard
                        title="Estanterias"
                        description="Gestiona las estanterias de la biblioteca"
                        href="/bookshelves"
                        icon={Library}
                    />
                ) : (
                    ""
                )}

                {auth.permissions.includes('product.view') ? (
                    <DashboardCard
                        title="Books"
                        description="Gestiona las estanterias de la biblioteca"
                        href="/books"
                        icon={Book}
                    />
                ) : (
                    ""
                )}

                {auth.permissions.includes("report.view") && auth.permissions.includes("report.print") ? (
                    <DashboardCard
                        title="Loans"
                        description="Gestiona los préstamos de la biblioteca"
                        href="/loans"
                        icon={Handshake}
                    />
                ) : (
                    ""
                )}

                {auth.permissions.includes("report.view") && auth.permissions.includes("report.print") ? (
                    <DashboardCard
                        title="Reservations"
                        description="Gestiona las reservas de la biblioteca"
                        href="/reservations"
                        icon={Calendar}
                    />
                ) : (
                    ""
                )}

                {auth.permissions.includes('settings.access') ? (
                    <DashboardCard
                        title="Timeline"
                        description="Ve tu historial de préstamos y reservas"
                        href="/timelines"
                        icon={Clock}
                    />
                ) : (
                    ""
                )}

                {auth.permissions.includes('settings.access') ? (
                    <DashboardCard
                        title="Graph"
                        description="Revisa los graficos de la biblioteca"
                        href="/graphs"
                        icon={ChartNoAxesCombined}
                    />
                ) : (
                    ""
                )}
            </div>
        </AppLayout>
    );
}
