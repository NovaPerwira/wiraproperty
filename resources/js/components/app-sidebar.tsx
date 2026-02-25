import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { BedDouble, BookOpen, CalendarDays, ClipboardList, CreditCard, Folder, LayoutGrid, ShieldCheck, Users } from 'lucide-react';
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
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const role = auth?.user?.role ?? 'staff';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        // Operations: admin and super_admin
        ...(role === 'admin' || role === 'super_admin'
            ? [
                { title: 'Bookings', href: '/bookings' as string, icon: CalendarDays },
                { title: 'Rooms', href: '/rooms' as string, icon: BedDouble },
                { title: 'Calendar', href: '/calendar' as string, icon: CalendarDays },
                { title: 'Guest Database', href: '/guests' as string, icon: Users },
                { title: 'Payments', href: '/payments' as string, icon: CreditCard },
                { title: 'Housekeeping', href: '/housekeeping' as string, icon: ClipboardList },
            ]
            : []),
        // User Management: super_admin only
        ...(role === 'super_admin'
            ? [{ title: 'User Management', href: '/users' as string, icon: ShieldCheck }]
            : []),
    ];


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
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

