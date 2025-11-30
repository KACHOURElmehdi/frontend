'use client';

import React from 'react';
import { FileText, X, Loader2, AlertCircle } from 'lucide-react';
import UploadStatusItem from './UploadStatusItem';

export interface UploadingFile {
    file: File;
    status: 'PENDING' | 'UPLOADING' | 'SUCCESS' | 'ERROR';
    id?: number;
    error?: string;
}

interface UploadListProps {
    files: UploadingFile[];
    onRemove: (fileName: string) => void;
}

export default function UploadList({ files, onRemove }: UploadListProps) {
    if (files.length === 0) return null;

    return (
        <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Selected Files ({files.length})</h3>
            <div className="space-y-2">
                {files.map((item) => {
                    if (item.status === 'SUCCESS' && item.id) {
                        return (
                            <UploadStatusItem
                                key={item.file.name}
                                documentId={item.id}
                                originalFilename={item.file.name}
                                fileSize={item.file.size}
                            />
                        );
                    }

                    return (
                        <div
                            key={item.file.name}
                            className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                        >
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(item.file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                {item.status === 'UPLOADING' && (
                                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                )}
                                {item.status === 'ERROR' && (
                                    <div className="flex items-center gap-2 text-red-500">
                                        <span className="text-xs">{item.error || 'Failed'}</span>
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                )}

                                {item.status === 'PENDING' && (
                                    <button
                                        onClick={() => onRemove(item.file.name)}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

