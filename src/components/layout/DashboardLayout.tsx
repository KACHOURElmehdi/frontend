'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar, { MobileNav } from './Sidebar';
import Topbar from './Topbar';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Misc';

interface Breadcrumb {
    label: string;
    href: string;
    current?: boolean;
}

export interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    breadcrumbs?: Breadcrumb[];
}

export default function DashboardLayout({ 
    children, 
    title, 
    description, 
    breadcrumbs 
}: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/');
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner size="lg" label="Loading..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar 
                    isCollapsed={sidebarCollapsed} 
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden">
                    <div 
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 z-50 w-64">
                        <Sidebar onToggle={() => setMobileMenuOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className={cn(
                "transition-all duration-300",
                sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
            )}>
                {/* Topbar */}
                <Topbar 
                    onMenuClick={() => setMobileMenuOpen(true)} 
                    showMenuButton={true}
                />

                {/* Page Content */}
                <main className="p-4 lg:p-6 pb-20 lg:pb-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        {(breadcrumbs || title || description) && (
                            <div className="mb-6">
                                {breadcrumbs && breadcrumbs.length > 0 && (
                                    <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-2">
                                        {breadcrumbs.map((crumb, index) => (
                                            <React.Fragment key={crumb.href}>
                                                {index > 0 && <ChevronRight className="w-4 h-4" />}
                                                {crumb.current ? (
                                                    <span className="text-foreground font-medium">{crumb.label}</span>
                                                ) : (
                                                    <Link 
                                                        href={crumb.href}
                                                        className="hover:text-foreground transition-colors"
                                                    >
                                                        {crumb.label}
                                                    </Link>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </nav>
                                )}
                                {title && (
                                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                                )}
                                {description && (
                                    <p className="text-foreground-muted mt-1">{description}</p>
                                )}
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <MobileNav />
        </div>
    );
}
