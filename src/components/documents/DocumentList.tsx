'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, ChevronRight, Download } from 'lucide-react';
import { Document } from '@/types';
import DocumentStatus from './DocumentStatus';
import { downloadDocument } from '@/lib/downloadDocument';

interface DocumentListProps {
    documents: Document[];
    loading?: boolean;
}

export default function DocumentList({ documents, loading }: DocumentListProps) {
    const [downloading, setDownloading] = useState<number | null>(null);

    const handleDownload = async (doc: Document) => {
        try {
            setDownloading(doc.id);
            await downloadDocument(doc.id, doc.originalFilename);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download file');
        } finally {
            setDownloading(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No documents found</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Document
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Confidence
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{doc.originalFilename}</div>
                                        <div className="text-xs text-gray-500">
                                            {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'Unknown date'}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                    {doc.category || 'Uncategorized'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <DocumentStatus status={doc.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {doc.confidence ? `${(doc.confidence * 100).toFixed(1)}%` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleDownload(doc)}
                                        disabled={downloading === doc.id}
                                        className="text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                                        title="Download file"
                                    >
                                        <Download className={`w-5 h-5 ${downloading === doc.id ? 'animate-pulse' : ''}`} />
                                    </button>
                                    <Link href={`/documents/${doc.id}`} className="text-blue-600 hover:text-blue-900">
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
