'use client';

import React, { useEffect, useState, use } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Spinner, EmptyState, Progress } from '@/components/ui/Misc';
import { apiClient } from '@/lib/apiClient';
import { Document } from '@/types';
import { useSSE } from '@/hooks/useSSE';
import { usePolling } from '@/hooks/usePolling';
import { useQuery } from '@tanstack/react-query';
import { getCategories, deleteDocument as deleteDocumentApi } from '@/services/document.service';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FileText,
    Download,
    RefreshCw,
    Tag,
    FolderOpen,
    Calendar,
    Clock,
    Zap,
    AlertCircle,
    Copy,
    ArrowLeft,
    Trash2,
    Edit3,
    FileType,
    Hash,
    Gauge,
    Loader2,
    X,
    Plus
} from 'lucide-react';
import { downloadDocument } from '@/lib/downloadDocument';
import DocumentActionsMenu from '@/components/documents/DocumentActionsMenu';

export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReclassifyModal, setShowReclassifyModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isReclassifying, setIsReclassifying] = useState(false);
    const [showOcrText, setShowOcrText] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const router = useRouter();

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const categoryOptions = React.useMemo(() => {
        const base = [{ value: '', label: 'Select a category' }];
        if (!categories) {
            return base;
        }
        return [
            ...base,
            ...categories.map((cat: any) => ({
                value: String(cat.id),
                label: cat.name ?? `Category ${cat.id}`,
            })),
        ];
    }, [categories]);

    const handleDownload = async () => {
        if (!document) {
            return;
        }
        try {
            setIsDownloading(true);
            await downloadDocument(document.id, document.originalFilename || document.filename || 'document');
        } catch (err) {
            console.error('Failed to download document', err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDeleteDocument = async () => {
        if (!document) {
            return;
        }
        if (!confirm(`Delete ${document.originalFilename || document.filename}? This action cannot be undone.`)) {
            return;
        }
        try {
            setIsDeleting(true);
            await deleteDocumentApi(document.id);
            router.push('/search');
        } catch (err) {
            console.error('Failed to delete document', err);
        } finally {
            setIsDeleting(false);
        }
    };

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

    const shouldListen = document?.status === 'PROCESSING' || document?.status === 'UPLOADED';

    useSSE(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api'}/documents/${id}/events`, {
        enabled: shouldListen,
        onMessage: (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'PROCESS_COMPLETE' || data.type === 'TAGGED' || data.type === 'CLASSIFIED') {
                    fetchDocument();
                }
            } catch (e) {
                console.error('SSE parse error', e);
            }
        },
        onError: () => {}
    });

    usePolling(fetchDocument, {
        enabled: shouldListen,
        interval: 3000
    });

    const handleReclassify = async () => {
        if (!selectedCategory) return;
        
        setIsReclassifying(true);
        try {
            await apiClient.post(`/documents/${id}/reclassify`, { categoryId: selectedCategory });
            await fetchDocument();
            setShowReclassifyModal(false);
            setSelectedCategory('');
        } catch (err) {
            console.error('Reclassification failed', err);
        } finally {
            setIsReclassifying(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // TODO: Show toast
    };

    if (loading) {
        return (
            <DashboardLayout title="Loading..." breadcrumbs={[]}>
                <Card>
                    <CardContent className="py-20">
                        <Spinner size="lg" label="Loading document..." className="mx-auto" />
                    </CardContent>
                </Card>
            </DashboardLayout>
        );
    }

    if (error || !document) {
        return (
            <DashboardLayout 
                title="Document Not Found"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Documents', href: '/search' },
                ]}
            >
                <Card>
                    <CardContent className="py-20">
                        <EmptyState
                            icon={<AlertCircle className="w-8 h-8" />}
                            title="Document not found"
                            description={error || "The document you're looking for doesn't exist or you don't have access to it."}
                            action={
                                <Link href="/search">
                                    <Button variant="outline">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Documents
                                    </Button>
                                </Link>
                            }
                        />
                    </CardContent>
                </Card>
            </DashboardLayout>
        );
    }

    const confidenceScore = document.confidence ? Math.round(document.confidence * 100) : null;
    const documentIdString = document.id !== undefined && document.id !== null ? String(document.id) : '';
    const documentIdPreview = documentIdString
        ? `${documentIdString.slice(0, 8)}${documentIdString.length > 8 ? '…' : ''}`
        : 'N/A';

    return (
        <DashboardLayout 
            title={document.originalFilename || document.filename || 'Document Details'}
            description="View and manage document details"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Documents', href: '/search' },
                { label: document.originalFilename || 'Document', href: `/documents/${id}`, current: true },
            ]}
        >
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Link href="/search">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Documents
                        </Button>
                    </Link>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
                            <Download className="w-4 h-4 mr-2" />
                            {isDownloading ? 'Downloading…' : 'Download'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowReclassifyModal(true)}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reclassify
                        </Button>
                        <DocumentActionsMenu
                            documentId={Number(id)}
                            onDownload={handleDownload}
                            onDelete={handleDeleteDocument}
                            downloading={isDownloading}
                            deleting={isDeleting}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Document Info Card */}
                        <Card variant="glass">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                                        <FileText className="w-8 h-8 text-primary" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h1 className="text-xl font-bold text-foreground mb-1">
                                                    {document.originalFilename || document.filename}
                                                </h1>
                                                <p className="text-sm text-foreground-muted">
                                                    {document.contentType?.split('/')[1]?.toUpperCase() || 'FILE'} • {document.size ? `${(document.size / 1024).toFixed(2)} KB` : 'Unknown size'}
                                                </p>
                                            </div>
                                            <StatusBadge status={document.status} />
                                        </div>

                                        {/* Processing Indicator */}
                                        {(document.status === 'PROCESSING' || document.status === 'UPLOADED') && (
                                            <div className="mt-4 p-4 rounded-xl bg-warning/10 border border-warning/20">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Loader2 className="w-5 h-5 text-warning animate-spin" />
                                                    <span className="font-medium text-warning">Processing document...</span>
                                                </div>
                                                <p className="text-sm text-foreground-muted">
                                                    AI is analyzing your document. This usually takes 5-15 seconds.
                                                </p>
                                                <Progress value={60} max={100} className="mt-3 h-1.5" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Classification Result */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-primary" />
                                    Classification Result
                                </CardTitle>
                                <CardDescription>AI-powered document analysis</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Category */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-background-subtle">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FolderOpen className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-foreground-muted">Category</p>
                                            <p className="font-semibold text-foreground">
                                                {document.category?.name || 'Uncategorized'}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setShowReclassifyModal(true)}>
                                        <Edit3 className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Confidence Score */}
                                {confidenceScore !== null && (
                                    <div className="p-4 rounded-xl bg-background-subtle">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                                    <Gauge className="w-5 h-5 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-foreground-muted">Confidence Score</p>
                                                    <p className="font-semibold text-foreground">{confidenceScore}%</p>
                                                </div>
                                            </div>
                                            <Badge variant={confidenceScore >= 80 ? 'success' : confidenceScore >= 50 ? 'warning' : 'destructive'}>
                                                {confidenceScore >= 80 ? 'High' : confidenceScore >= 50 ? 'Medium' : 'Low'}
                                            </Badge>
                                        </div>
                                        <Progress 
                                            value={confidenceScore} 
                                            max={100}
                                            className="h-2"
                                        />
                                    </div>
                                )}

                                {/* Tags */}
                                <div className="p-4 rounded-xl bg-background-subtle">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                                                <Tag className="w-5 h-5 text-success" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-foreground-muted">Tags</p>
                                                <p className="font-semibold text-foreground">
                                                    {document.tags?.length || 0} tags
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {document.tags && document.tags.length > 0 ? (
                                            document.tags.map((tag) => (
                                                <Badge key={tag.id} variant="secondary">
                                                    {tag.name}
                                                    <button className="ml-1 hover:text-error transition-colors">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-foreground-muted">No tags assigned</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* OCR Text */}
                        <Card variant="glass">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileType className="w-5 h-5 text-primary" />
                                        Extracted Text (OCR)
                                    </CardTitle>
                                    <CardDescription>Text content extracted from document</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => document.ocrText && copyToClipboard(document.ocrText)}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setShowOcrText(!showOcrText)}
                                    >
                                        {showOcrText ? 'Collapse' : 'Expand'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {document.ocrText ? (
                                    <div className={`relative ${!showOcrText ? 'max-h-48 overflow-hidden' : ''}`}>
                                        <pre className="text-sm text-foreground-muted whitespace-pre-wrap font-mono bg-background-subtle p-4 rounded-xl">
                                            {document.ocrText}
                                        </pre>
                                        {!showOcrText && (
                                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
                                        )}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={<FileType className="w-8 h-8" />}
                                        title="No text extracted"
                                        description="OCR processing may still be in progress or the document doesn't contain extractable text."
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Metadata */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-base">Document Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-border">
                                    <span className="text-sm text-foreground-muted flex items-center gap-2">
                                        <Hash className="w-4 h-4" />
                                        ID
                                    </span>
                                    <span className="text-sm font-mono text-foreground truncate max-w-[120px]" title={documentIdString}>
                                        {documentIdPreview}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-border">
                                    <span className="text-sm text-foreground-muted flex items-center gap-2">
                                        <FileType className="w-4 h-4" />
                                        File Type
                                    </span>
                                    <Badge variant="outline">{document.contentType?.split('/')[1]?.toUpperCase() || 'Unknown'}</Badge>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-border">
                                    <span className="text-sm text-foreground-muted flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Created
                                    </span>
                                    <span className="text-sm text-foreground">
                                        {document.uploadedAt ? format(new Date(document.uploadedAt), 'MMM d, yyyy') : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-foreground-muted flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Processed
                                    </span>
                                    <span className="text-sm text-foreground">
                                        {document.processedAt ? format(new Date(document.processedAt), 'MMM d, yyyy') : 'N/A'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card variant="gradient">
                            <CardContent className="p-6 space-y-3">
                                <h4 className="font-semibold text-foreground">Quick Actions</h4>
                                <Button
                                    variant="default"
                                    className="w-full justify-start"
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {isDownloading ? 'Downloading…' : 'Download Original'}
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => setShowReclassifyModal(true)}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Reclassify Document
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-error hover:bg-error/10"
                                    onClick={handleDeleteDocument}
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    {isDeleting ? 'Deleting…' : 'Delete Document'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Reclassify Modal */}
            <Modal
                isOpen={showReclassifyModal}
                onClose={() => setShowReclassifyModal(false)}
                title="Reclassify Document"
            >
                <div className="space-y-4">
                    <p className="text-foreground-muted">
                        Select a new category for this document. This will override the AI classification.
                    </p>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Category</label>
                        <Select
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            options={categoryOptions}
                            className="w-full"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setShowReclassifyModal(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="gradient" 
                            onClick={handleReclassify}
                            disabled={!selectedCategory || isReclassifying}
                            isLoading={isReclassifying}
                        >
                            Reclassify
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
