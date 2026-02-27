import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { BedDouble, CalendarDays, ClipboardList, CreditCard, LayoutGrid, ShieldCheck, Users } from 'lucide-react';
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
import { useTranslation } from 'react-i18next';


export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const role = auth?.user?.role ?? 'staff';

    const { t } = useTranslation();

    const mainNavItems: NavItem[] = [
        {
            title: t('common.dashboard'),
            href: '/admin/dashboard' as string,
            icon: LayoutGrid,
        },
        // Operations: admin and super_admin
        ...(role === 'admin' || role === 'super_admin'
            ? [
                { title: t('common.bookings'), href: '/admin/bookings' as string, icon: CalendarDays },
                { title: t('common.rooms'), href: '/admin/rooms' as string, icon: BedDouble },
                { title: t('common.calendar'), href: '/admin/calendar' as string, icon: CalendarDays },
                { title: t('common.guests'), href: '/admin/guests' as string, icon: Users },
                { title: t('common.payments'), href: '/admin/payments' as string, icon: CreditCard },
                { title: t('common.housekeeping'), href: '/admin/housekeeping' as string, icon: ClipboardList },
            ]
            : []),
        // User Management: super_admin only
        ...(role === 'super_admin'
            ? [{ title: t('common.users'), href: '/admin/users' as string, icon: ShieldCheck }]
            : []),
    ];


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={'/admin/dashboard'} prefetch>
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

