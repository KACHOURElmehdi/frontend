'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import StatsOverview from '@/components/dashboard/StatsOverview';
import CategoryChart from '@/components/dashboard/CategoryChart';
import { useQuery } from '@tanstack/react-query';
import { getStats, getCategoryStats } from '@/services/stats.service';
import { Loader2 } from 'lucide-react';

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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
                        Failed to load dashboard data. Please try again later.
                    </div>
                ) : (
                    <>
                        {stats && <StatsOverview stats={stats} />}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <CategoryChart data={categoryStats || []} />

                            {/* Placeholder for another chart or recent activity */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <p className="text-gray-500">No recent activity to show.</p>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
