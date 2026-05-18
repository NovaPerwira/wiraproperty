import { Link } from '@inertiajs/react';
import { ChevronDown, Globe } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';
import { useState } from 'react';

export interface NavCmsGroup {
    label: string;
    icon?: React.ElementType;
    items: NavItem[];
}

export function NavCms({ groups, title, groupIcon: GroupIcon }: { groups: NavCmsGroup[], title?: string, groupIcon?: React.ElementType }) {
    const { isCurrentUrl } = useCurrentUrl();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
        // Auto-open the group that contains the current URL
        return {};
    });

    const toggle = (label: string) =>
        setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));

    // Check if any item in a group is active
    const isGroupActive = (items: NavItem[]) =>
        items.some(item => isCurrentUrl(item.href));

    return (
        <SidebarGroup className="px-2 py-0">
            {title && (
                <SidebarGroupLabel className="flex items-center gap-1.5">
                    {GroupIcon && <GroupIcon size={13} />}
                    {title}
                </SidebarGroupLabel>
            )}
            <SidebarMenu>
                {groups.map((group) => {
                    const active = isGroupActive(group.items);
                    const open = openGroups[group.label] ?? active;

                    return (
                        <Collapsible
                            key={group.label}
                            open={open}
                            onOpenChange={() => toggle(group.label)}
                            asChild
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={{ children: group.label }}
                                        isActive={active}
                                        className="w-full justify-between"
                                    >
                                        <span className="flex items-center gap-2">
                                            {group.icon && <group.icon size={16} />}
                                            <span>{group.label}</span>
                                        </span>
                                        <ChevronDown
                                            size={14}
                                            className={`ml-auto shrink-0 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                        />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {group.items.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={isCurrentUrl(item.href)}
                                                >
                                                    <Link href={item.href} prefetch>
                                                        {item.icon && <item.icon size={14} />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
