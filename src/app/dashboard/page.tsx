'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner, EmptyState } from '@/components/ui/Misc';
import { useQuery } from '@tanstack/react-query';
import { getStats, getCategoryStats } from '@/services/stats.service';
import { searchDocuments } from '@/services/document.service';
import { 
    FileText, 
    CheckCircle2, 
    AlertCircle, 
    Tag, 
    FolderOpen, 
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Upload,
    Zap
} from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: { value: number; isPositive: boolean };
    description?: string;
    color?: 'primary' | 'success' | 'warning' | 'error';
}

function StatCard({ title, value, icon, trend, description, color = 'primary' }: StatCardProps) {
    const colorClasses = {
        primary: 'from-primary/10 to-primary/5 text-primary',
        success: 'from-success/10 to-success/5 text-success',
        warning: 'from-warning/10 to-warning/5 text-warning',
        error: 'from-error/10 to-error/5 text-error',
    };

    return (
        <Card variant="glass" className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground-muted">{title}</p>
                        <p className="text-3xl font-bold text-foreground">{value}</p>
                        {trend && (
                            <div className="flex items-center gap-1 text-sm">
                                {trend.isPositive ? (
                                    <ArrowUpRight className="w-4 h-4 text-success" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 text-error" />
                                )}
                                <span className={trend.isPositive ? 'text-success' : 'text-error'}>
                                    {trend.value}%
                                </span>
                                <span className="text-foreground-muted">vs last week</span>
                            </div>
                        )}
                        {description && (
                            <p className="text-xs text-foreground-muted">{description}</p>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>
    );
}

function CategoryDistribution({ data }: { data: Array<{ name: string; count: number }> }) {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

    return (
        <Card variant="glass">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-primary" />
                    Category Distribution
                </CardTitle>
                <CardDescription>Documents by category</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <EmptyState 
                        icon={<FolderOpen />} 
                        title="No categories yet" 
                        description="Upload documents to see category distribution"
                    />
                ) : (
                    <div className="space-y-4">
                        {/* Visual Bar */}
                        <div className="flex h-3 rounded-full overflow-hidden bg-background-subtle">
                            {data.map((item, i) => (
                                <div
                                    key={item.name}
                                    className="h-full transition-all duration-500"
                                    style={{
                                        width: `${(item.count / total) * 100}%`,
                                        backgroundColor: colors[i % colors.length],
                                    }}
                                />
                            ))}
                        </div>
                        
                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-3">
                            {data.map((item, i) => (
                                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-background-subtle">
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: colors[i % colors.length] }}
                                        />
                                        <span className="text-sm font-medium text-foreground truncate">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-sm text-foreground-muted">
                                        {item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Helper function to get status info from document
function getDocumentStatus(doc: any) {
    switch (doc.status) {
        case 'PROCESSED':
            return { action: 'Classification complete', status: 'success' };
        case 'PROCESSING':
            return { action: 'Processing started', status: 'processing' };
        case 'ERROR':
            return { action: 'Processing failed', status: 'error' };
        case 'UPLOADED':
            return { action: 'Document uploaded', status: 'success' };
        default:
            return { action: 'Document updated', status: 'info' };
    }
}

function RecentActivity() {
    const { data: recentDocs, isLoading } = useQuery({
        queryKey: ['recent-documents'],
        queryFn: () => searchDocuments({ limit: 5, size: 5 }),
    });

    const activities = recentDocs?.content?.map(doc => {
        const statusInfo = getDocumentStatus(doc);
        return {
            id: doc.id,
            name: doc.originalFilename,
            time: formatRelativeTime(doc.processedAt || doc.uploadedAt),
            ...statusInfo
        };
    }) || [];

    const statusColors = {
        success: 'bg-success/10 text-success',
        processing: 'bg-warning/10 text-warning',
        info: 'bg-primary/10 text-primary',
        error: 'bg-error/10 text-error',
    };

    return (
        <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>Latest document actions</CardDescription>
                </div>
                <Button variant="ghost" size="sm">View all</Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Spinner size="md" label="Loading activity..." />
                    </div>
                ) : activities.length === 0 ? (
                    <EmptyState 
                        icon={<Clock />} 
                        title="No recent activity" 
                        description="Activity will appear here as you use the platform"
                    />
                ) : (
                    <div className="space-y-3">
                        {activities.map((activity) => (
                            <div 
                                key={activity.id}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-subtle transition-colors"
                            >
                                <div className={`p-2 rounded-lg ${statusColors[activity.status as keyof typeof statusColors]}`}>
                                    {activity.status === 'success' && <CheckCircle2 className="w-4 h-4" />}
                                    {activity.status === 'processing' && <Clock className="w-4 h-4" />}
                                    {activity.status === 'info' && <Zap className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {activity.name}
                                    </p>
                                    <p className="text-xs text-foreground-muted">{activity.action}</p>
                                </div>
                                <span className="text-xs text-foreground-muted whitespace-nowrap">
                                    {activity.time}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function QuickActions() {
    return (
        <Card variant="gradient" className="relative overflow-hidden">
            <CardContent className="p-6">
                <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Quick Actions</h3>
                    <p className="text-sm text-foreground-muted mb-4">
                        Get started with common tasks
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/upload">
                            <Button variant="default" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Document
                            </Button>
                        </Link>
                        <Link href="/documents">
                            <Button variant="outline" size="sm">
                                <FileText className="w-4 h-4 mr-2" />
                                View All Documents
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button variant="ghost" size="sm">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Analytics
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
        queryKey: ['stats'],
        queryFn: getStats,
    });

    const { data: categoryStats, isLoading: categoriesLoading } = useQuery({
        queryKey: ['stats', 'categories'],
        queryFn: getCategoryStats,
    });

    const loading = statsLoading || categoriesLoading;
    const error = statsError;

    return (
        <DashboardLayout 
            title="Dashboard" 
            description="Overview of your document management"
            breadcrumbs={[{ label: 'Dashboard', href: '/dashboard', current: true }]}
        >
            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <Spinner size="lg" label="Loading dashboard..." />
                </div>
            ) : error ? (
                <Card variant="outline" className="border-error/20 bg-error/5">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load dashboard</h3>
                        <p className="text-foreground-muted mb-4">
                            There was an error loading your dashboard data. Please try again.
                        </p>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Documents"
                            value={stats?.totalDocuments || 0}
                            icon={<FileText className="w-5 h-5" />}
                            trend={{ value: 12, isPositive: true }}
                            color="primary"
                        />
                        <StatCard
                            title="Processed"
                            value={stats?.processedDocuments || 0}
                            icon={<CheckCircle2 className="w-5 h-5" />}
                            description={`${stats?.totalDocuments ? Math.round((stats?.processedDocuments / stats?.totalDocuments) * 100) : 0}% completion rate`}
                            color="success"
                        />
                        <StatCard
                            title="Categories"
                            value={stats?.totalCategories || 0}
                            icon={<FolderOpen className="w-5 h-5" />}
                            color="warning"
                        />
                        <StatCard
                            title="Tags"
                            value={stats?.totalTags || 0}
                            icon={<Tag className="w-5 h-5" />}
                            color="primary"
                        />
                    </div>

                    {/* Quick Actions */}
                    <QuickActions />

                    {/* Charts and Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <CategoryDistribution data={categoryStats || []} />
                        <RecentActivity />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
