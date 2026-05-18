import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import {
    BedDouble,
    CalendarDays,
    ClipboardList,
    Coffee,
    CreditCard,
    LayoutGrid,
    ShieldCheck,
    Users,
    MessageSquare,
    Image,
    Star,
    Sparkles,
    FileText,
    Settings,
    BarChart,
    CalendarOff,
    Home,
    MapPin,
    BookOpen,
    TreePine,
    Building2,
    Palmtree,
    Globe,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavCms } from '@/components/nav-cms';
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

    const dashboardItems: NavItem[] = [
        {
            title: t('common.dashboard'),
            href: '/admin/dashboard' as string,
            icon: LayoutGrid,
        },
    ];

    const generalOperationsGroups = role === 'admin' || role === 'super_admin' ? [
        {
            label: 'Properties & Rooms',
            icon: Building2,
            items: [
                { title: 'Villa', href: '/admin/properties/villa' as string, icon: Palmtree },
                { title: 'Property', href: '/admin/properties/general' as string, icon: Building2 },
                { title: 'Tanah', href: '/admin/properties/tanah' as string, icon: TreePine },
                { title: t('common.rooms'), href: '/admin/rooms' as string, icon: BedDouble },
            ],
        },
        {
            label: 'Operations',
            icon: Settings,
            items: [
                { title: t('common.bookings'), href: '/admin/bookings' as string, icon: CalendarDays },
                { title: t('common.calendar'), href: '/admin/calendar' as string, icon: CalendarDays },
                { title: t('common.guests'), href: '/admin/guests' as string, icon: Users },
                { title: t('common.payments'), href: '/admin/payments' as string, icon: CreditCard },
                { title: t('common.housekeeping'), href: '/admin/housekeeping' as string, icon: ClipboardList },
            ]
        }
    ] : [];

    // ── CMS groups (collapsible) ────────────────────────────────────────────────
    const cmsGroups = role === 'admin' || role === 'super_admin' ? [
        {
            label: 'Page Content',
            icon: BookOpen,
            items: [
                { title: 'Homepage', href: '/admin/cms/homepage' as string, icon: Home },
                { title: 'Gallery Section', href: '/admin/cms/gallery-section' as string, icon: Image },
                { title: 'Stays Page', href: '/admin/cms/stays' as string, icon: BedDouble },
                { title: 'Experience Page', href: '/admin/cms/experience' as string, icon: Sparkles },
                { title: 'Dining Page', href: '/admin/cms/dining' as string, icon: Coffee },
                { title: 'About Page', href: '/admin/cms/about' as string, icon: MapPin },
            ],
        },
        {
            label: 'Villa',
            icon: Palmtree,
            items: [
                { title: 'Villa Bali', href: '/admin/cms/villa/bali' as string, icon: Palmtree },
                { title: 'Villa Lombok', href: '/admin/cms/villa/lombok' as string, icon: Palmtree },
            ],
        },
        {
            label: 'Property',
            icon: Building2,
            items: [
                { title: 'Rumah', href: '/admin/cms/property/rumah' as string, icon: Home },
                { title: 'Ruko', href: '/admin/cms/property/ruko' as string, icon: Building2 },
                { title: 'Villa', href: '/admin/cms/property/villa' as string, icon: Sparkles },
            ],
        },
        {
            label: 'Tanah',
            icon: TreePine,
            items: [
                { title: 'Tanah', href: '/admin/cms/tanah' as string, icon: TreePine },
            ],
        },
        {
            label: 'Media & Social',
            icon: Image,
            items: [
                { title: 'Gallery', href: '/admin/cms/gallery' as string, icon: Image },
                { title: 'Testimonials', href: '/admin/cms/testimonials' as string, icon: Star },
                { title: 'Facilities', href: '/admin/cms/facilities' as string, icon: Sparkles },
            ],
        },
        {
            label: 'Operations',
            icon: Settings,
            items: [
                { title: 'Inquiries', href: '/admin/cms/inquiries' as string, icon: MessageSquare },
                { title: 'Block & Availability', href: '/admin/cms/availability' as string, icon: CalendarOff },
                { title: 'Dynamic Pages', href: '/admin/cms/pages' as string, icon: FileText },
            ],
        },
        {
            label: 'Analytics & SEO',
            icon: BarChart,
            items: [
                { title: 'Analytics', href: '/admin/cms/analytics' as string, icon: BarChart },
                { title: 'SEO & Settings', href: '/admin/cms/seo' as string, icon: Settings },
            ],
        },
    ] : [];

    const adminItems: NavItem[] = role === 'super_admin' ? [
        { title: t('common.users'), href: '/admin/users' as string, icon: ShieldCheck },
    ] : [];

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
                <NavMain items={dashboardItems} label="Overview" />
                {generalOperationsGroups.length > 0 && <NavCms groups={generalOperationsGroups} title="General Operations" groupIcon={Building2} />}
                {cmsGroups.length > 0 && <NavCms groups={cmsGroups} title="Website CMS" groupIcon={Globe} />}
                {adminItems.length > 0 && <NavMain items={adminItems} label="Administration" />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
