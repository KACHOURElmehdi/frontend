'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, SearchInput } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import { Spinner, EmptyState } from '@/components/ui/Misc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { searchDocuments, getCategories, deleteDocument } from '@/services/document.service';
import { useDebounce } from '@/hooks/useDebounce';
import { format } from 'date-fns';
import Link from 'next/link';
import {
    Search,
    Filter,
    FileText,
    Eye,
    Download,
    Grid3X3,
    List,
    SlidersHorizontal,
    X,
    FolderOpen,
    Calendar,
    Tag
} from 'lucide-react';
import { downloadDocument } from '@/lib/downloadDocument';
import { Document } from '@/types';
import DocumentActionsMenu from '@/components/documents/DocumentActionsMenu';

type ViewMode = 'table' | 'grid';
type SortField = 'name' | 'createdAt' | 'status' | 'category';
type SortOrder = 'asc' | 'desc';

export default function DocumentsPage() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(0);
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [showFilters, setShowFilters] = useState(false);
    const pageSize = 12;
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const debouncedQuery = useDebounce(query, 500);

    React.useEffect(() => {
        setPage(0);
    }, [debouncedQuery, category, status]);

    const { data: searchData, isLoading } = useQuery({
        queryKey: ['documents', 'search', debouncedQuery, category, status, page, sortField, sortOrder],
        queryFn: () => searchDocuments({
            q: debouncedQuery,
            category: category || undefined,
            status: status || undefined,
            page,
            limit: pageSize,
        }),
        placeholderData: (previousData) => previousData,
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const deleteMutation = useMutation({
        mutationFn: (documentId: number) => deleteDocument(documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents', 'search'], exact: false });
        },
        onSettled: () => setDeletingId(null),
    });

    const handleDownload = async (doc: Document) => {
        try {
            setDownloadingId(doc.id);
            await downloadDocument(doc.id, doc.originalFilename || doc.filename || 'document');
        } catch (error) {
            console.error('Failed to download document', error);
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDelete = (doc: Document) => {
        if (!confirm(`Delete ${doc.originalFilename || doc.filename}? This action cannot be undone.`)) {
            return;
        }
        setDeletingId(doc.id);
        deleteMutation.mutate(doc.id);
    };

    const categoryOptions = React.useMemo(() => {
        const base = [{ value: '', label: 'All Categories' }];
        if (!categories) {
            return base;
        }
        return [
            ...base,
            ...categories.map((cat: any) => ({
                value: cat.name ?? String(cat.id),
                label: cat.name ?? `Category ${cat.id}`,
            })),
        ];
    }, [categories]);

    const statusOptions = React.useMemo(() => ([
        { value: '', label: 'All Status' },
        { value: 'UPLOADED', label: 'Uploaded' },
        { value: 'PROCESSING', label: 'Processing' },
        { value: 'PROCESSED', label: 'Processed' },
        { value: 'ERROR', label: 'Error' },
    ]), []);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const clearFilters = () => {
        setQuery('');
        setCategory('');
        setStatus('');
        setPage(0);
    };

    const hasActiveFilters = query || category || status;

    const documents = searchData?.content || [];
    const totalPages = searchData?.totalPages || 1;
    const totalElements = searchData?.totalElements || 0;

    return (
        <DashboardLayout 
            title="Documents" 
            description="Browse and manage all your documents"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Documents', href: '/search', current: true },
            ]}
        >
            <div className="space-y-6">
                {/* Search and Filter Bar */}
                <Card variant="glass">
                    <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-1">
                                <SearchInput
                                    placeholder="Search documents by name, content, tags..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Filter Controls */}
                            <div className="flex items-center gap-3">
                                <Select
                                    value={category}
                                    onChange={setCategory}
                                    options={categoryOptions}
                                    className="w-40"
                                />

                                <Select
                                    value={status}
                                    onChange={setStatus}
                                    options={statusOptions}
                                    className="w-36"
                                />

                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={showFilters ? 'bg-primary/5' : ''}
                                >
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    Filters
                                </Button>

                                {/* View Toggle */}
                                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`p-2 transition-colors ${
                                            viewMode === 'table' 
                                                ? 'bg-primary text-white' 
                                                : 'hover:bg-background-subtle'
                                        }`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 transition-colors ${
                                            viewMode === 'grid' 
                                                ? 'bg-primary text-white' 
                                                : 'hover:bg-background-subtle'
                                        }`}
                                    >
                                        <Grid3X3 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {hasActiveFilters && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                                <span className="text-sm text-foreground-muted">Active filters:</span>
                                {query && (
                                    <Badge variant="secondary" className="gap-1">
                                        Search: {query}
                                        <button onClick={() => setQuery('')}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                )}
                                {category && (
                                    <Badge variant="secondary" className="gap-1">
                                        Category: {category}
                                        <button onClick={() => setCategory('')}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                )}
                                {status && (
                                    <Badge variant="secondary" className="gap-1">
                                        Status: {status}
                                        <button onClick={() => setStatus('')}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                )}
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    Clear all
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results Summary */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground-muted">
                        {isLoading ? (
                            'Loading...'
                        ) : (
                            <>Showing {documents.length} of {totalElements} documents</>
                        )}
                    </p>
                </div>

                {/* Content */}
                {isLoading ? (
                    <Card>
                        <CardContent className="py-12">
                            <Spinner size="lg" label="Loading documents..." className="mx-auto" />
                        </CardContent>
                    </Card>
                ) : documents.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <EmptyState
                                icon={<FileText className="w-8 h-8" />}
                                title={hasActiveFilters ? "No documents found" : "No documents yet"}
                                description={
                                    hasActiveFilters 
                                        ? "Try adjusting your search or filters"
                                        : "Upload your first document to get started"
                                }
                                action={
                                    hasActiveFilters ? (
                                        <Button variant="outline" onClick={clearFilters}>
                                            Clear filters
                                        </Button>
                                    ) : (
                                        <Link href="/upload">
                                            <Button variant="gradient">Upload Document</Button>
                                        </Link>
                                    )
                                }
                            />
                        </CardContent>
                    </Card>
                ) : viewMode === 'table' ? (
                    /* Table View */
                    <Card variant="glass">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        sortable
                                        sortDirection={sortField === 'name' ? sortOrder : null}
                                        onSort={() => handleSort('name')}
                                    >
                                        Document
                                    </TableHead>
                                    <TableHead className="font-medium text-foreground-muted">Category</TableHead>
                                    <TableHead
                                        sortable
                                        sortDirection={sortField === 'status' ? sortOrder : null}
                                        onSort={() => handleSort('status')}
                                    >
                                        Status
                                    </TableHead>
                                    <TableHead className="font-medium text-foreground-muted">Tags</TableHead>
                                    <TableHead
                                        sortable
                                        sortDirection={sortField === 'createdAt' ? sortOrder : null}
                                        onSort={() => handleSort('createdAt')}
                                    >
                                        Date
                                    </TableHead>
                                    <TableHead className="font-medium text-foreground-muted text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((doc: Document) => (
                                    <TableRow key={doc.id} className="group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <Link 
                                                        href={`/documents/${doc.id}`}
                                                        className="font-medium text-foreground hover:text-primary transition-colors"
                                                    >
                                                        {doc.originalFilename || doc.filename}
                                                    </Link>
                                                    <p className="text-xs text-foreground-muted">
                                                        {doc.contentType?.split('/')[1]?.toUpperCase() || 'FILE'} • {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {doc.category ? (
                                                <Badge variant="outline">
                                                    <FolderOpen className="w-3 h-3 mr-1" />
                                                    {doc.category.name}
                                                </Badge>
                                            ) : (
                                                <span className="text-foreground-muted">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={doc.status} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {doc.tags?.slice(0, 2).map((tag) => (
                                                    <Badge key={tag.id} variant="secondary" className="text-xs">
                                                        {tag.name}
                                                    </Badge>
                                                ))}
                                                {(doc.tags?.length ?? 0) > 2 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{(doc.tags?.length ?? 0) - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-foreground-muted">
                                            {doc.uploadedAt ? format(new Date(doc.uploadedAt), 'MMM d, yyyy') : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/documents/${doc.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDownload(doc)}
                                                    disabled={downloadingId === doc.id}
                                                >
                                                    <Download
                                                        className={`w-4 h-4 ${downloadingId === doc.id ? 'animate-pulse opacity-70' : ''}`}
                                                    />
                                                </Button>
                                                <DocumentActionsMenu
                                                    documentId={doc.id}
                                                    viewHref={`/documents/${doc.id}`}
                                                    onDelete={() => handleDelete(doc)}
                                                    deleting={deletingId === doc.id && deleteMutation.isPending}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                ) : (
                    /* Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {documents.map((doc: any) => (
                            <Link href={`/documents/${doc.id}`} key={doc.id}>
                                <Card variant="interactive" className="h-full group cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <FileText className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                                    {doc.originalFilename || doc.filename}
                                                </h3>
                                                <p className="text-xs text-foreground-muted">
                                                    {doc.contentType?.split('/')[1]?.toUpperCase() || 'FILE'} • {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <StatusBadge status={doc.status} />
                                                {doc.category && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {doc.category.name}
                                                    </Badge>
                                                )}
                                            </div>

                                            {doc.tags?.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {doc.tags.slice(0, 3).map((tag: any) => (
                                                        <Badge key={tag.id} variant="secondary" className="text-xs">
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1 text-xs text-foreground-muted pt-2 border-t border-border">
                                                <Calendar className="w-3 h-3" />
                                                {doc.uploadedAt ? format(new Date(doc.uploadedAt), 'MMM d, yyyy') : 'N/A'}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex justify-center">
                        <Pagination
                            currentPage={page + 1}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setPage(newPage - 1)}
                        />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

