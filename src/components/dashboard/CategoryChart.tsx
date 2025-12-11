'use client';

import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { CategoryStat } from '@/types';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

interface CategoryChartProps {
    data: CategoryStat[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
    const chartData = {
        labels: data.map(d => d.name),
        datasets: [
            {
                label: '# of Documents',
                data: data.map(d => d.count),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)', // Blue
                    'rgba(16, 185, 129, 0.6)', // Green
                    'rgba(245, 158, 11, 0.6)', // Amber
                    'rgba(239, 68, 68, 0.6)',  // Red
                    'rgba(139, 92, 246, 0.6)', // Purple
                    'rgba(236, 72, 153, 0.6)', // Pink
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
            <div className="h-64 flex items-center justify-center">
                {data.length > 0 ? (
                    <Pie data={chartData} options={{ maintainAspectRatio: false }} />
                ) : (
                    <p className="text-gray-500">No data available</p>
                )}
            </div>
        </div>
    );
}
