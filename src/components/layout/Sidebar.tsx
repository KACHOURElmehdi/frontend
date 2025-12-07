'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
    LayoutDashboard, 
    Upload, 
    FileText, 
    FolderOpen, 
    Tags, 
    Settings, 
    Search,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Moon,
    Sun,
    Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    requiresAdmin?: boolean;
}

const mainNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/categories', label: 'Categories', icon: FolderOpen },
    { href: '/tags', label: 'Tags', icon: Tags },
];

const bottomNavItems: NavItem[] = [
    { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const { logout, isAdmin } = useAuth();
    const [isDark, setIsDark] = React.useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <aside className={cn(
            "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
            isCollapsed ? "w-16" : "w-64"
        )}>
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className={cn(
                    "flex items-center h-16 px-4 border-b border-border",
                    isCollapsed ? "justify-center" : "justify-between"
                )}>
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-lg font-bold text-foreground">
                                DocClassifier
                            </span>
                        )}
                    </Link>
                    {!isCollapsed && onToggle && (
                        <button
                            onClick={onToggle}
                            className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-secondary transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {mainNavItems
                        .filter((item) => !item.requiresAdmin || isAdmin)
                        .map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground-secondary hover:bg-secondary hover:text-foreground",
                                    isCollapsed && "justify-center px-0"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon className={cn(
                                    "flex-shrink-0",
                                    isCollapsed ? "w-5 h-5" : "w-5 h-5"
                                )} />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-1">{item.label}</span>
                                        {item.badge && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="px-3 py-4 border-t border-border space-y-1">
                    {bottomNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground-secondary hover:bg-secondary hover:text-foreground",
                                    isCollapsed && "justify-center px-0"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 w-full",
                            "text-foreground-secondary hover:bg-secondary hover:text-foreground",
                            isCollapsed && "justify-center px-0"
                        )}
                        title={isCollapsed ? "Toggle Theme" : undefined}
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <Moon className="w-5 h-5 flex-shrink-0" />
                        )}
                        {!isCollapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 w-full",
                            "text-error hover:bg-error-light",
                            isCollapsed && "justify-center px-0"
                        )}
                        title={isCollapsed ? "Logout" : undefined}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>

                {/* Collapse Button (when collapsed) */}
                {isCollapsed && onToggle && (
                    <div className="px-3 py-4 border-t border-border">
                        <button
                            onClick={onToggle}
                            className="flex items-center justify-center w-full p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-secondary transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}

// Mobile Bottom Navigation
export function MobileNav() {
    const pathname = usePathname();
    
    const mobileNavItems = [
        { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
        { href: '/upload', label: 'Upload', icon: Upload },
        { href: '/documents', label: 'Docs', icon: FileText },
        { href: '/search', label: 'Search', icon: Search },
        { href: '/settings', label: 'More', icon: Settings },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border md:hidden">
            <div className="flex items-center justify-around h-16">
                {mobileNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-foreground-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
