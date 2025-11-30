'use client';

import React, { useEffect, useState, use } from 'react';
import Navbar from '@/components/Navbar';
import DocumentDetail from '@/components/documents/DocumentDetail';
import { apiClient } from '@/lib/apiClient';
import { Document } from '@/types';
import { useSSE } from '@/hooks/useSSE';
import { usePolling } from '@/hooks/usePolling';

export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDocument = async () => {
        try {
            const response = await apiClient.get<Document>(`/documents/${id}`);
            setDocument(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch document', err);
            setError('Failed to load document');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocument();
    }, [id]);

    // Real-time updates
    // Only listen if status is processing
    const shouldListen = document?.status === 'PROCESSING' || document?.status === 'UPLOADED';

    // SSE
    useSSE(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api'}/documents/${id}/events`, {
        enabled: shouldListen,
        onMessage: (event) => {
            try {
                const data = JSON.parse(event.data);
                // Update document based on event
                // If event is PROCESS_COMPLETE, we might want to re-fetch or update local state
                if (data.type === 'PROCESS_COMPLETE' || data.type === 'TAGGED' || data.type === 'CLASSIFIED') {
                    fetchDocument();
                }
            } catch (e) {
                console.error('SSE parse error', e);
            }
        },
        onError: () => {
            // Fallback to polling handled by separate hook or logic
        }
    });

    // Polling fallback
    usePolling(fetchDocument, {
        enabled: shouldListen,
        interval: 3000
    });

    const handleReclassify = async (categoryId: string) => {
        try {
            await apiClient.post(`/documents/${id}/reclassify`, { categoryId });
            fetchDocument();
        } catch (err) {
            console.error('Reclassification failed', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto py-10 px-4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
                        {error}
                    </div>
                ) : document ? (
                    <DocumentDetail
                        document={document}
                        onReclassify={handleReclassify}
                        isAdmin={true} // TODO: Check admin role from AuthContext
                    />
                ) : (
                    <div className="text-center text-gray-500">Document not found</div>
                )}
            </main>
        </div>
    );
}
