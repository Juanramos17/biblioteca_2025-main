import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { useTranslations } from '@/hooks/use-translations';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen, Folder, LayoutGrid, Users,
    Building2, MapPin, Library, Book,
    Handshake, Calendar, Clock, ChartNoAxesCombined
} from 'lucide-react';
import AppLogo from './app-logo';

interface PageProps {
    auth: {
        user: any;
        permissions: string[];
    };
}

export function AppSidebar() {
    const { t } = useTranslations();
    const page = usePage<{ props: PageProps }>();
    const permissions = page.props.auth.permissions;

    const mainNavItems: NavItem[] = [
        {
            title: t('ui.navigation.items.dashboard'),
            url: '/dashboard',
            icon: LayoutGrid,
        },
        permissions.includes('users.view') && {
            title: t('ui.navigation.items.users'),
            url: '/users',
            icon: Users,
        },
        permissions.includes('report.view') && permissions.includes('report.print') && {
            title: t('ui.navigation.items.floors'),
            url: '/floors',
            icon: Building2,
        },
        permissions.includes('report.view') && permissions.includes('report.print') && {
            title: t('ui.navigation.items.zones'),
            url: '/zones',
            icon: MapPin,
        },
        permissions.includes('report.view') && permissions.includes('report.print') && {
            title: t('ui.navigation.items.bookshelves'),
            url: '/bookshelves',
            icon: Library,
        },
        permissions.includes('product.view') && {
            title: t('ui.navigation.items.books'),
            url: '/books',
            icon: Book,
        },
        permissions.includes('report.view') && permissions.includes('report.print') && {
            title: t('ui.navigation.items.loans'),
            url: '/loans',
            icon: Handshake,
        },
        permissions.includes('report.view') && permissions.includes('report.print') && {
            title: t('ui.navigation.items.reservations'),
            url: '/reservations',
            icon: Calendar,
        },
        permissions.includes('settings.access') && {
            title: t('ui.navigation.items.stadistics'),
            url: '/graphs',
            icon: ChartNoAxesCombined,
        },
    ].filter(Boolean) as NavItem[];

    const footerNavItems: NavItem[] = [
        permissions.includes('settings.access') && {
            title: t('ui.navigation.items.timeline'),
            url: '/timelines',
            icon: Clock,
        },
        {
            title: t('ui.navigation.items.repository'),
            url: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: t('ui.navigation.items.documentation'),
            url: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ].filter(Boolean) as NavItem[];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
