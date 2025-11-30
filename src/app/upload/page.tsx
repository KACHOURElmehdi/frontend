'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import UploadDropzone from '@/components/upload/UploadDropzone';
import UploadList, { UploadingFile } from '@/components/upload/UploadList';
import { apiClient } from '@/lib/apiClient';
import { useSSE } from '@/hooks/useSSE';
import { usePolling } from '@/hooks/usePolling';

export default function UploadPage() {
    const [files, setFiles] = useState<UploadingFile[]>([]);
    const [uploadIds, setUploadIds] = useState<string[]>([]);

    // SSE for real-time updates
    // We need to listen to events for each uploaded document.
    // Since useSSE takes one URL, and we might have multiple docs, 
    // we might need a different approach or a global event stream.
    // The prompt says: EventSource(`${API_BASE}/api/documents/{id}/events?token=${token}`)
    // This implies one connection per document.
    // For simplicity, let's use polling for the list of uploaded documents status if we have multiple.
    // Or we can try to manage multiple SSE connections (complex).
    // Let's stick to polling for the list status for now, as it's more robust for multiple files.
    // Or better: The prompt says "Pour chaque id: ouvrir SSE stream".
    // We can create a sub-component for each file that handles its own SSE connection.

    const handleFilesSelected = async (selectedFiles: File[]) => {
        const newFiles = selectedFiles.map(file => ({
            file,
            status: 'PENDING' as const,
        }));

        setFiles(prev => [...prev, ...newFiles]);

        // Process uploads
        for (const fileItem of newFiles) {
            const formData = new FormData();
            formData.append('file', fileItem.file);

            try {
                setFiles(prev => prev.map(f => f.file === fileItem.file ? { ...f, status: 'UPLOADING' } : f));

                const response = await apiClient.post('/documents/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Backend returns a single Document object
                const result = response.data;

                if (result && result.id) {
                    setFiles(prev => prev.map(f => f.file === fileItem.file ? { ...f, status: 'PROCESSED', id: result.id } : f));
                    setUploadIds(prev => [...prev, result.id]);
                }
            } catch (error: any) {
                console.error('Upload failed', error);
                const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
                setFiles(prev => prev.map(f => f.file === fileItem.file ? { ...f, status: 'ERROR', error: errorMessage } : f));
            }
        }
    };

    const handleRemove = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.file.name !== fileName));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Documents</h1>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <UploadDropzone onFilesSelected={handleFilesSelected} />
                    <UploadList files={files} onRemove={handleRemove} />
                </div>
            </main>
        </div>
    );
}
