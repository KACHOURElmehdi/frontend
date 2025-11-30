'use client';

import React from 'react';
import { FileText, CheckCircle, AlertCircle, BarChart } from 'lucide-react';
import { StatsOverview as StatsType } from '@/types';

interface StatsOverviewProps {
    stats: StatsType;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Documents</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDocuments}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Processed</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.processedDocuments}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Errors</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.errorDocuments}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Avg Confidence</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {(stats.averageConfidence * 100).toFixed(1)}%
                        </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <BarChart className="w-6 h-6 text-purple-600" />
                    </div>
                </div>
            </div>
        </div>
    );
}
