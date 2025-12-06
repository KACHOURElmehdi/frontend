'use client';

import React, { useState, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Misc';
import { apiClient } from '@/lib/apiClient';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import {
    Upload,
    CloudUpload,
    FileText,
    CheckCircle2,
    AlertCircle,
    X,
    Loader2,
    Eye,
    ExternalLink,
    FileImage,
    FileArchive,
    Clock
} from 'lucide-react';

interface UploadingFile {
    file: File;
    id?: string;
    status: 'pending' | 'uploading' | 'processing' | 'success' | 'error';
    progress?: number;
    error?: string;
    category?: string;
}

function getFileIcon(type: string) {
    if (type.includes('image')) return FileImage;
    if (type.includes('zip') || type.includes('archive')) return FileArchive;
    return FileText;
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function UploadPage() {
    const [files, setFiles] = useState<UploadingFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newFiles: UploadingFile[] = acceptedFiles.map(file => ({
            file,
            status: 'pending',
            progress: 0,
        }));

        setFiles(prev => [...newFiles, ...prev]);
        setIsUploading(true);

        // Process uploads sequentially
        for (let i = 0; i < newFiles.length; i++) {
            const fileItem = newFiles[i];
            
            try {
                // Update to uploading
                setFiles(prev => prev.map(f => 
                    f.file === fileItem.file ? { ...f, status: 'uploading', progress: 0 } : f
                ));

                const formData = new FormData();
                formData.append('file', fileItem.file);

                const response = await apiClient.post('/documents/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const progress = progressEvent.total 
                            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            : 0;
                        setFiles(prev => prev.map(f => 
                            f.file === fileItem.file ? { ...f, progress } : f
                        ));
                    },
                });

                const result = response.data;
                
                // Update to processing
                setFiles(prev => prev.map(f => 
                    f.file === fileItem.file 
                        ? { ...f, status: 'processing', progress: 100, id: result.id } 
                        : f
                ));

                // Simulate processing delay, then success
                setTimeout(() => {
                    setFiles(prev => prev.map(f => 
                        f.file === fileItem.file 
                            ? { ...f, status: 'success', category: result.category?.name || 'Uncategorized' } 
                            : f
                    ));
                }, 1500);

            } catch (error: any) {
                console.error('Upload failed', error);
                setFiles(prev => prev.map(f => 
                    f.file === fileItem.file 
                        ? { ...f, status: 'error', error: error?.response?.data?.message || 'Upload failed' } 
                        : f
                ));
            }
        }

        setIsUploading(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'image/*': ['.png', '.jpg', '.jpeg'],
            'text/plain': ['.txt'],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    const removeFile = (file: File) => {
        setFiles(prev => prev.filter(f => f.file !== file));
    };

    const clearCompleted = () => {
        setFiles(prev => prev.filter(f => f.status !== 'success'));
    };

    const successCount = files.filter(f => f.status === 'success').length;
    const errorCount = files.filter(f => f.status === 'error').length;
    const processingCount = files.filter(f => f.status === 'uploading' || f.status === 'processing').length;

    return (
        <DashboardLayout 
            title="Upload Documents" 
            description="Drag and drop files for AI-powered classification"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Upload', href: '/upload', current: true },
            ]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Zone - Main Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Dropzone */}
                    <Card variant="glass">
                        <CardContent className="p-0">
                            <div
                                {...getRootProps()}
                                className={`
                                    relative p-12 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
                                    ${isDragActive 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-border hover:border-primary/50 hover:bg-background-subtle'
                                    }
                                    ${isDragAccept ? 'border-success bg-success/5' : ''}
                                    ${isDragReject ? 'border-error bg-error/5' : ''}
                                `}
                            >
                                <input {...getInputProps()} />
                                
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className={`
                                        w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300
                                        ${isDragActive 
                                            ? 'bg-primary/20 text-primary scale-110' 
                                            : 'bg-gradient-to-br from-primary/10 to-accent/10 text-primary'
                                        }
                                    `}>
                                        <CloudUpload className="w-10 h-10" />
                                    </div>
                                    
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                                    </h3>
                                    <p className="text-foreground-muted mb-4">
                                        or click to browse from your computer
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        <Badge variant="secondary">.pdf</Badge>
                                        <Badge variant="secondary">.docx</Badge>
                                        <Badge variant="secondary">.doc</Badge>
                                        <Badge variant="secondary">.txt</Badge>
                                        <Badge variant="secondary">.png</Badge>
                                        <Badge variant="secondary">.jpg</Badge>
                                    </div>
                                    
                                    <p className="text-xs text-foreground-muted mt-4">
                                        Maximum file size: 10MB
                                    </p>
                                </div>

                                {/* Animated border on drag */}
                                {isDragActive && (
                                    <div className="absolute inset-0 rounded-xl border-2 border-primary animate-pulse pointer-events-none" />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* File List */}
                    {files.length > 0 && (
                        <Card variant="glass">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" />
                                        Uploaded Files
                                    </CardTitle>
                                    <CardDescription>
                                        {files.length} file{files.length !== 1 ? 's' : ''} • 
                                        {successCount} completed • {processingCount} processing
                                    </CardDescription>
                                </div>
                                {successCount > 0 && (
                                    <Button variant="ghost" size="sm" onClick={clearCompleted}>
                                        Clear completed
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {files.map((fileItem, index) => {
                                        const FileIcon = getFileIcon(fileItem.file.type);
                                        
                                        return (
                                            <div
                                                key={`${fileItem.file.name}-${index}`}
                                                className={`
                                                    relative p-4 rounded-xl border transition-all duration-300
                                                    ${fileItem.status === 'error' 
                                                        ? 'bg-error/5 border-error/20' 
                                                        : fileItem.status === 'success'
                                                            ? 'bg-success/5 border-success/20'
                                                            : 'bg-background-subtle border-border hover:border-primary/30'
                                                    }
                                                `}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`
                                                        w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                                                        ${fileItem.status === 'error' 
                                                            ? 'bg-error/10 text-error' 
                                                            : fileItem.status === 'success'
                                                                ? 'bg-success/10 text-success'
                                                                : 'bg-primary/10 text-primary'
                                                        }
                                                    `}>
                                                        <FileIcon className="w-6 h-6" />
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-medium text-foreground truncate">
                                                                {fileItem.file.name}
                                                            </p>
                                                            {fileItem.category && (
                                                                <Badge variant="outline" className="shrink-0">
                                                                    {fileItem.category}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-foreground-muted">
                                                            <span>{formatFileSize(fileItem.file.size)}</span>
                                                            {fileItem.status === 'uploading' && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>Uploading {fileItem.progress}%</span>
                                                                </>
                                                            )}
                                                            {fileItem.status === 'processing' && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                                        Classifying...
                                                                    </span>
                                                                </>
                                                            )}
                                                            {fileItem.error && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="text-error">{fileItem.error}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        
                                                        {(fileItem.status === 'uploading' || fileItem.status === 'processing') && (
                                                            <div className="mt-2">
                                                                <Progress 
                                                                    value={fileItem.progress || 0} 
                                                                    max={100}
                                                                    className="h-1.5"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {fileItem.status === 'success' && fileItem.id && (
                                                            <Link href={`/documents/${fileItem.id}`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        {fileItem.status === 'success' && (
                                                            <CheckCircle2 className="w-5 h-5 text-success" />
                                                        )}
                                                        {fileItem.status === 'error' && (
                                                            <AlertCircle className="w-5 h-5 text-error" />
                                                        )}
                                                        {(fileItem.status === 'pending' || fileItem.status === 'error') && (
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                onClick={() => removeFile(fileItem.file)}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Upload Stats */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-base">Upload Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-background-subtle">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Upload className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm text-foreground">Total Files</span>
                                </div>
                                <span className="font-semibold text-foreground">{files.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-background-subtle">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-success" />
                                    </div>
                                    <span className="text-sm text-foreground">Completed</span>
                                </div>
                                <span className="font-semibold text-success">{successCount}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-background-subtle">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-warning" />
                                    </div>
                                    <span className="text-sm text-foreground">Processing</span>
                                </div>
                                <span className="font-semibold text-warning">{processingCount}</span>
                            </div>
                            {errorCount > 0 && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-error/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                                            <AlertCircle className="w-4 h-4 text-error" />
                                        </div>
                                        <span className="text-sm text-foreground">Failed</span>
                                    </div>
                                    <span className="font-semibold text-error">{errorCount}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tips */}
                    <Card variant="gradient" className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <h4 className="font-semibold text-foreground mb-3">💡 Tips</h4>
                            <ul className="space-y-2 text-sm text-foreground-muted">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    Upload multiple files at once for batch processing
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    Supported formats: PDF, DOCX, DOC, TXT, PNG, JPG
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    Maximum file size is 10MB per file
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    AI classification takes about 5-10 seconds
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Quick Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/documents" className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View All Documents
                                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                                </Button>
                            </Link>
                            <Link href="/dashboard" className="block">
                                <Button variant="ghost" className="w-full justify-start">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Go to Dashboard
                                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
