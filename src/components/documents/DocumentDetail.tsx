'use client';

import React, { useState } from 'react';
import { Document } from '@/types';
import DocumentStatus from './DocumentStatus';
import TagList from '@/components/tags/TagList';
import { FileText, Calendar, Database, RefreshCw, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { downloadDocument } from '@/lib/downloadDocument';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocument } from '@/services/document.service';
import { useSSE } from '@/hooks/useSSE';
import ReclassifyModal from './ReclassifyModal';

interface DocumentDetailProps {
    document: Document; // Initial data
    isAdmin?: boolean;
}

export default function DocumentDetail({ document: initialDocument, isAdmin }: DocumentDetailProps) {
    const [downloading, setDownloading] = useState(false);
    const [isReclassifyOpen, setIsReclassifyOpen] = useState(false);
    const queryClient = useQueryClient();

    // Use React Query for live data
    const { data: document } = useQuery({
        queryKey: ['document', initialDocument.id],
        queryFn: () => getDocument(initialDocument.id),
        initialData: initialDocument,
        // Poll every 3s if processing, otherwise stop polling (unless SSE is active, handled below)
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return status === 'PROCESSING' || status === 'UPLOADED' ? 3000 : false;
        },
    });

    // Use SSE for real-time updates
    // We pass the document ID to the URL if the backend supports filtering by ID, 
    // otherwise we listen to the global stream and filter in the hook (if implemented).
    // Assuming backend supports /api/documents/{id}/events
    const { isConnected } = useSSE(`/documents/${document.id}/events`, {
        enabled: document.status === 'PROCESSING' || document.status === 'UPLOADED',
        onMessage: () => {
            // The hook already invalidates 'documents' query key. 
            // We should also invalidate this specific document.
            queryClient.invalidateQueries({ queryKey: ['document', document.id] });
        }
    });

    const handleDownload = async () => {
        try {
            setDownloading(true);
            await downloadDocument(document.id, document.originalFilename);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download file');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{document.originalFilename}</h1>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'Unknown date'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Database className="w-4 h-4" />
                                {document.size ? `${(document.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <DocumentStatus status={document.status} className="text-sm px-3 py-1" />
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleDownload}
                        disabled={downloading}
                    >
                        <Download className={`w-4 h-4 ${downloading ? 'animate-pulse' : ''}`} />
                        {downloading ? 'Downloading...' : 'Download'}
                    </Button>
                    {isAdmin && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => setIsReclassifyOpen(true)}
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reclassify
                        </Button>
                    )}
                </div>
            </div>

            {document.errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-red-800">Processing Error</h3>
                        <p className="text-sm text-red-600 mt-1">{document.errorMessage}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Extracted Text */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Extracted Text</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm text-gray-700 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                            {document.extractedText || 'No text extracted yet.'}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Classification */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Classification</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Category</p>
                                <p className="font-medium text-gray-900">
                                    {document.category?.name || 'Uncategorized'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Confidence</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full"
                                            style={{ width: `${(document.confidence || 0) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {document.confidence ? `${(document.confidence * 100).toFixed(0)}%` : '0%'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Model Version</p>
                                <p className="font-medium text-gray-900">{document.modelVersion || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Extracted Data</h2>
                        {document.tags && document.tags.length > 0 ? (
                            <TagList tags={document.tags} />
                        ) : (
                            <p className="text-sm text-gray-500">No tags extracted.</p>
                        )}
                    </div>
                </div>
            </div>

            <ReclassifyModal
                documentId={document.id}
                currentCategoryId={document.category?.id}
                isOpen={isReclassifyOpen}
                onClose={() => setIsReclassifyOpen(false)}
            />
        </div>
    );
}

