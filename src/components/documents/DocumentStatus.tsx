import React from 'react';
import { CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface DocumentStatusProps {
    status: 'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'ERROR';
    className?: string;
}

export default function DocumentStatus({ status, className }: DocumentStatusProps) {
    const styles = {
        UPLOADED: 'bg-gray-100 text-gray-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        PROCESSED: 'bg-green-100 text-green-700',
        ERROR: 'bg-red-100 text-red-700',
    };

    const icons = {
        UPLOADED: Clock,
        PROCESSING: Loader2,
        PROCESSED: CheckCircle,
        ERROR: AlertCircle,
    };

    const Icon = icons[status];

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                styles[status],
                className
            )}
        >
            <Icon className={cn('w-3 h-3 mr-1', status === 'PROCESSING' && 'animate-spin')} />
            {status}
        </span>
    );
}
