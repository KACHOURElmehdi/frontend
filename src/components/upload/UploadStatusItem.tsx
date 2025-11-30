'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDocument } from '@/services/document.service';
import { Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import Link from 'next/link';

interface UploadStatusItemProps {
    documentId: number;
    originalFilename: string;
    fileSize: number;
}

export default function UploadStatusItem({ documentId, originalFilename, fileSize }: UploadStatusItemProps) {
    const { data: document, isLoading } = useQuery({
        queryKey: ['document', documentId],
        queryFn: () => getDocument(documentId),
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return status === 'PROCESSING' || status === 'UPLOADED' ? 2000 : false;
        },
    });

    if (isLoading || !document) {
        return (
            <div className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{originalFilename}</p>
                        <p className="text-xs text-gray-500">{(fileSize / 1024).toFixed(1)} KB</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Loading...</span>
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-500" />
                </div>
                <div className="min-w-0">
                    <Link href={`/documents/${document.id}`} className="text-sm font-medium text-blue-600 hover:underline truncate">
                        {document.originalFilename}
                    </Link>
                    <p className="text-xs text-gray-500">{(fileSize / 1024).toFixed(1)} KB</p>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                {document.status === 'PROCESSING' || document.status === 'UPLOADED' ? (
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-blue-600 font-medium">Processing...</span>
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    </div>
                ) : document.status === 'PROCESSED' ? (
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-600 font-medium">Ready</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-red-600 font-medium">Error</span>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                )}
            </div>
        </div>
    );
}
