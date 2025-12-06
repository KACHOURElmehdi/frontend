'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
    Search, 
    Bell, 
    User,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Avatar } from '@/components/ui/Misc';

interface TopbarProps {
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export default function Topbar({ onMenuClick, showMenuButton = false }: TopbarProps) {
    const pathname = usePathname();
    const { user } = useAuth();
    const [searchOpen, setSearchOpen] = React.useState(false);
    const [notificationsOpen, setNotificationsOpen] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);

    // Generate breadcrumbs from pathname
    const breadcrumbs = React.useMemo(() => {
        if (!pathname) return [];
        const paths = pathname.split('/').filter(Boolean);
        return paths.map((path, index) => ({
            label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
            href: '/' + paths.slice(0, index + 1).join('/'),
            isLast: index === paths.length - 1,
        }));
    }, [pathname]);

    return (
        <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-lg border-b border-border">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {showMenuButton && (
                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-secondary transition-colors lg:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    )}

                    {/* Breadcrumbs */}
                    <nav className="hidden sm:flex items-center gap-1 text-sm">
                        <Link 
                            href="/dashboard" 
                            className="text-foreground-muted hover:text-foreground transition-colors"
                        >
                            Home
                        </Link>
                        {breadcrumbs.map((crumb) => (
                            <React.Fragment key={crumb.href}>
                                <ChevronRight className="w-4 h-4 text-foreground-muted" />
                                {crumb.isLast ? (
                                    <span className="font-medium text-foreground">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link 
                                        href={crumb.href}
                                        className="text-foreground-muted hover:text-foreground transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Search Button */}
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground-muted bg-secondary rounded-lg hover:bg-secondary-hover transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Search...</span>
                        <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium text-foreground-muted bg-background rounded border border-border">
                            ⌘K
                        </kbd>
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="relative p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-secondary transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
                        </button>

                        {notificationsOpen && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg animate-scale-in">
                                <div className="p-4 border-b border-border">
                                    <h3 className="font-semibold text-foreground">Notifications</h3>
                                </div>
                                <div className="p-4 text-center text-foreground-muted text-sm">
                                    No new notifications
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary transition-colors"
                        >
                            <Avatar 
                                name={user?.email || 'User'} 
                                size="sm"
                            />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg animate-scale-in py-1">
                                <div className="px-4 py-3 border-b border-border">
                                    <p className="text-sm font-medium text-foreground">{user?.email || 'User'}</p>
                                    <p className="text-xs text-foreground-muted">{user?.role || 'USER'}</p>
                                </div>
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    Settings
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Modal (Command Palette) */}
            {searchOpen && (
                <SearchModal onClose={() => setSearchOpen(false)} />
            )}
        </header>
    );
}

// Search Modal Component
function SearchModal({ onClose }: { onClose: () => void }) {
    const [query, setQuery] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        inputRef.current?.focus();
    }, []);

    React.useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-x-0 top-[20%] mx-auto max-w-xl px-4">
                <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                    <div className="flex items-center gap-3 px-4 border-b border-border">
                        <Search className="w-5 h-5 text-foreground-muted" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search documents, categories, tags..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 py-4 bg-transparent text-foreground placeholder:text-foreground-muted focus:outline-none"
                        />
                        <button
                            onClick={onClose}
                            className="p-1 rounded text-foreground-muted hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-4">
                        <p className="text-sm text-foreground-muted text-center py-8">
                            Start typing to search...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Breadcrumbs Component
interface BreadcrumbsProps {
    items: { label: string; href?: string }[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav className={cn("flex items-center gap-1 text-sm", className)}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <ChevronRight className="w-4 h-4 text-foreground-muted" />}
                    {item.href && index < items.length - 1 ? (
                        <Link 
                            href={item.href}
                            className="text-foreground-muted hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className={cn(
                            index === items.length - 1 
                                ? "font-medium text-foreground" 
                                : "text-foreground-muted"
                        )}>
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}
