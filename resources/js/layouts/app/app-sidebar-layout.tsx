import { AppContent } from '@/components/organisms/app-content';
import { AppShell } from '@/components/organisms/app-shell';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { AppSidebarHeader } from '@/components/mollecules/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
