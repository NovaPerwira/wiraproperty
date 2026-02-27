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


export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const role = auth?.user?.role ?? 'staff';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard' as string,
            icon: LayoutGrid,
        },
        // Operations: admin and super_admin
        ...(role === 'admin' || role === 'super_admin'
            ? [
                { title: 'Bookings', href: '/admin/bookings' as string, icon: CalendarDays },
                { title: 'Rooms', href: '/admin/rooms' as string, icon: BedDouble },
                { title: 'Calendar', href: '/admin/calendar' as string, icon: CalendarDays },
                { title: 'Guest Database', href: '/admin/guests' as string, icon: Users },
                { title: 'Payments', href: '/admin/payments' as string, icon: CreditCard },
                { title: 'Housekeeping', href: '/admin/housekeeping' as string, icon: ClipboardList },
            ]
            : []),
        // User Management: super_admin only
        ...(role === 'super_admin'
            ? [{ title: 'User Management', href: '/admin/users' as string, icon: ShieldCheck }]
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

