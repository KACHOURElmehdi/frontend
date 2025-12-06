'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import {
    User,
    Mail,
    Lock,
    Bell,
    Shield,
    Palette,
    Globe,
    CreditCard,
    LogOut,
    Trash2,
    Save,
    Check,
    Moon,
    Sun,
    Monitor,
    ChevronRight
} from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'appearance' | 'billing';

interface SettingsNavItemProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    active: boolean;
    onClick: () => void;
}

function SettingsNavItem({ icon, label, description, active, onClick }: SettingsNavItemProps) {
    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                ${active 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-background-subtle'
                }
            `}
        >
            <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${active ? 'bg-primary text-white' : 'bg-background-subtle text-foreground-muted'}
            `}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`font-medium ${active ? 'text-primary' : 'text-foreground'}`}>{label}</p>
                <p className="text-xs text-foreground-muted truncate">{description}</p>
            </div>
            <ChevronRight className={`w-4 h-4 ${active ? 'text-primary' : 'text-foreground-muted'}`} />
        </button>
    );
}

function ProfileSettings() {
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Implement save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
    };

    return (
        <div className="space-y-6">
            <Card variant="glass">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-border">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                            {user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <Button variant="outline" size="sm">Change Avatar</Button>
                            <p className="text-xs text-foreground-muted mt-1">JPG, PNG or GIF. Max 2MB</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                defaultValue={user?.fullName || ''}
                                leftIcon={User}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                defaultValue={user?.email || ''}
                                leftIcon={Mail}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button variant="gradient" onClick={handleSave} isLoading={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function SecuritySettings() {
    return (
        <div className="space-y-6">
            <Card variant="glass">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password regularly for security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                            leftIcon={Lock}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            leftIcon={Lock}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            leftIcon={Lock}
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button variant="gradient">Update Password</Button>
                    </div>
                </CardContent>
            </Card>

            <Card variant="glass">
                <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background-subtle">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-warning" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">2FA is not enabled</p>
                                <p className="text-sm text-foreground-muted">Secure your account with 2FA</p>
                            </div>
                        </div>
                        <Button variant="outline">Enable</Button>
                    </div>
                </CardContent>
            </Card>

            <Card variant="outline" className="border-error/20 bg-error/5">
                <CardHeader>
                    <CardTitle className="text-error">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">Delete Account</p>
                            <p className="text-sm text-foreground-muted">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function NotificationSettings() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        documentProcessed: true,
        weeklyDigest: true,
        marketing: false,
    });

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Card variant="glass">
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                    { key: 'documentProcessed', label: 'Document Processed', desc: 'Notify when documents are ready' },
                    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of activity' },
                    { key: 'marketing', label: 'Marketing Emails', desc: 'Tips, updates and promotions' },
                ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-background-subtle">
                        <div>
                            <p className="font-medium text-foreground">{item.label}</p>
                            <p className="text-sm text-foreground-muted">{item.desc}</p>
                        </div>
                        <button
                            onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                            className={`
                                relative w-12 h-6 rounded-full transition-colors
                                ${notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-border'}
                            `}
                        >
                            <span className={`
                                absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                                ${notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'}
                            `} />
                        </button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function AppearanceSettings() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    return (
        <Card variant="glass">
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how DocClassifier looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="mb-3 block">Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: 'light', icon: Sun, label: 'Light' },
                            { value: 'dark', icon: Moon, label: 'Dark' },
                            { value: 'system', icon: Monitor, label: 'System' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setTheme(option.value as typeof theme)}
                                className={`
                                    p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                                    ${theme === option.value 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-border hover:border-primary/30'
                                    }
                                `}
                            >
                                <option.icon className={`w-6 h-6 ${theme === option.value ? 'text-primary' : 'text-foreground-muted'}`} />
                                <span className={`text-sm font-medium ${theme === option.value ? 'text-primary' : 'text-foreground'}`}>
                                    {option.label}
                                </span>
                                {theme === option.value && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-background-subtle">
                    <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-foreground-muted" />
                        <div className="flex-1">
                            <p className="font-medium text-foreground">Language</p>
                            <p className="text-sm text-foreground-muted">English (US)</p>
                        </div>
                        <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function BillingSettings() {
    return (
        <div className="space-y-6">
            <Card variant="gradient" className="border-primary/20">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <Badge variant="default" className="mb-2">Current Plan</Badge>
                            <h3 className="text-2xl font-bold text-foreground">Free Plan</h3>
                            <p className="text-foreground-muted mt-1">Basic features for personal use</p>
                        </div>
                        <Button variant="gradient">Upgrade</Button>
                    </div>
                    <div className="mt-6 pt-6 border-t border-border">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-foreground">50</p>
                                <p className="text-sm text-foreground-muted">Documents/month</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">5GB</p>
                                <p className="text-sm text-foreground-muted">Storage</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">1</p>
                                <p className="text-sm text-foreground-muted">Team member</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card variant="glass">
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Manage your payment details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 rounded-xl bg-background-subtle flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">No payment method</p>
                                <p className="text-sm text-foreground-muted">Add a card to upgrade</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Add Card</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const { logout } = useAuth();

    const tabs = [
        { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile', description: 'Personal information' },
        { id: 'security', icon: <Shield className="w-5 h-5" />, label: 'Security', description: 'Password & 2FA' },
        { id: 'notifications', icon: <Bell className="w-5 h-5" />, label: 'Notifications', description: 'Email & push alerts' },
        { id: 'appearance', icon: <Palette className="w-5 h-5" />, label: 'Appearance', description: 'Theme & display' },
        { id: 'billing', icon: <CreditCard className="w-5 h-5" />, label: 'Billing', description: 'Plans & payments' },
    ] as const;

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileSettings />;
            case 'security': return <SecuritySettings />;
            case 'notifications': return <NotificationSettings />;
            case 'appearance': return <AppearanceSettings />;
            case 'billing': return <BillingSettings />;
        }
    };

    return (
        <DashboardLayout 
            title="Settings" 
            description="Manage your account and preferences"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Settings', href: '/settings', current: true },
            ]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((tab) => (
                        <SettingsNavItem
                            key={tab.id}
                            icon={tab.icon}
                            label={tab.label}
                            description={tab.description}
                            active={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                    
                    <div className="pt-4 border-t border-border mt-4">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-error/10 text-error"
                        >
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-error/10">
                                <LogOut className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium">Sign Out</p>
                                <p className="text-xs text-foreground-muted">Log out of your account</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {renderContent()}
                </div>
            </div>
        </DashboardLayout>
    );
}
