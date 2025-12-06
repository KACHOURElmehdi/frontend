'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner, EmptyState } from '@/components/ui/Misc';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import {
    Tag,
    Plus,
    Edit3,
    Trash2,
    Search,
    FileText,
    Hash,
    Palette,
    CheckCircle2,
    X,
    ShieldAlert
} from 'lucide-react';

interface TagItem {
    id: number;
    name: string;
    color?: string;
    documentCount?: number;
}

const PRESET_COLORS = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#64748b'
];

export default function TagsPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTag, setEditingTag] = useState<TagItem | null>(null);
    const [tagName, setTagName] = useState('');
    const [tagColor, setTagColor] = useState(PRESET_COLORS[0]);
    const { isAdmin, loading: authLoading } = useAuth();
    const layoutConfig = {
        title: 'Tags',
        description: 'Organize documents with custom tags',
        breadcrumbs: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Tags', href: '/tags', current: true },
        ] as const,
    };
    const queryEnabled = !authLoading && isAdmin;

    const { data: tags, isLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await apiClient.get('/tags');
            return response.data;
        },
        enabled: queryEnabled,
    });
    const isFetching = queryEnabled && isLoading;

    const createMutation = useMutation({
        mutationFn: (data: { name: string; color?: string }) => 
            apiClient.post('/tags', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            setShowCreateModal(false);
            resetForm();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: { name: string; color?: string } }) => 
            apiClient.put(`/tags/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            setEditingTag(null);
            resetForm();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiClient.delete(`/tags/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });

    const resetForm = () => {
        setTagName('');
        setTagColor(PRESET_COLORS[0]);
    };

    const handleOpenCreate = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const handleOpenEdit = (tag: TagItem) => {
        setTagName(tag.name);
        setTagColor(tag.color || PRESET_COLORS[0]);
        setEditingTag(tag);
    };

    const handleSubmit = () => {
        const data = {
            name: tagName,
            color: tagColor,
        };

        if (editingTag) {
            updateMutation.mutate({ id: editingTag.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const filteredTags = tags?.filter((tag: TagItem) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Group tags by first letter
    const groupedTags = filteredTags.reduce((groups: Record<string, TagItem[]>, tag: TagItem) => {
        const letter = tag.name.charAt(0).toUpperCase();
        if (!groups[letter]) {
            groups[letter] = [];
        }
        groups[letter].push(tag);
        return groups;
    }, {});

    const sortedLetters = Object.keys(groupedTags).sort();

    if (authLoading) {
        return (
            <DashboardLayout {...layoutConfig}>
                <Card>
                    <CardContent className="py-12">
                        <Spinner size="lg" label="Checking permissions..." className="mx-auto" />
                    </CardContent>
                </Card>
            </DashboardLayout>
        );
    }

    if (!isAdmin) {
        return (
            <DashboardLayout {...layoutConfig}>
                <Card>
                    <CardContent className="py-16 text-center space-y-4">
                        <ShieldAlert className="w-12 h-12 text-warning mx-auto" />
                        <h2 className="text-xl font-semibold text-foreground">Administrator access required</h2>
                        <p className="text-sm text-foreground-muted">
                            You need admin permissions to create, edit, or delete tags.
                        </p>
                    </CardContent>
                </Card>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout {...layoutConfig}>
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                        <Input
                            placeholder="Search tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button variant="gradient" onClick={handleOpenCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Tag
                    </Button>
                </div>

                {/* Tags Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card variant="glass">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Tag className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{tags?.length || 0}</p>
                                    <p className="text-sm text-foreground-muted">Total Tags</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="glass">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">
                                        {tags?.reduce((sum: number, tag: TagItem) => sum + (tag.documentCount || 0), 0) || 0}
                                    </p>
                                    <p className="text-sm text-foreground-muted">Tagged Documents</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="glass">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                    <Palette className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{PRESET_COLORS.length}</p>
                                    <p className="text-sm text-foreground-muted">Available Colors</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="glass">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                                    <Hash className="w-5 h-5 text-warning" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">
                                        {tags?.filter((t: TagItem) => (t.documentCount || 0) > 5).length || 0}
                                    </p>
                                    <p className="text-sm text-foreground-muted">Popular Tags</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tags List */}
                {isFetching ? (
                    <Card>
                        <CardContent className="py-12">
                            <Spinner size="lg" label="Loading tags..." className="mx-auto" />
                        </CardContent>
                    </Card>
                ) : filteredTags.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <EmptyState
                                icon={<Tag className="w-8 h-8" />}
                                title={searchQuery ? "No tags found" : "No tags yet"}
                                description={searchQuery 
                                    ? "Try adjusting your search" 
                                    : "Create your first tag to organize documents"
                                }
                                action={
                                    !searchQuery && (
                                        <Button variant="gradient" onClick={handleOpenCreate}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Tag
                                        </Button>
                                    )
                                }
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle>All Tags</CardTitle>
                            <CardDescription>Click on a tag to edit, or use the delete button to remove</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Tag Cloud View */}
                            <div className="flex flex-wrap gap-2 p-4 bg-background-subtle rounded-xl mb-6">
                                {filteredTags.map((tag: TagItem) => (
                                    <div
                                        key={tag.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleOpenEdit(tag)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                handleOpenEdit(tag);
                                            }
                                        }}
                                        className="group relative cursor-pointer focus:outline-none"
                                    >
                                        <Badge 
                                            className="pr-8 transition-all hover:scale-105"
                                            style={{ 
                                                backgroundColor: `${tag.color || PRESET_COLORS[0]}20`,
                                                color: tag.color || PRESET_COLORS[0],
                                                borderColor: `${tag.color || PRESET_COLORS[0]}40`
                                            }}
                                        >
                                            <span 
                                                className="w-2 h-2 rounded-full mr-1.5"
                                                style={{ backgroundColor: tag.color || PRESET_COLORS[0] }}
                                            />
                                            {tag.name}
                                            <span className="ml-2 text-xs opacity-60">
                                                {tag.documentCount || 0}
                                            </span>
                                        </Badge>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteMutation.mutate(tag.id);
                                            }}
                                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Alphabetical List */}
                            <div className="space-y-4">
                                {sortedLetters.map((letter) => (
                                    <div key={letter}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-bold text-primary">{letter}</span>
                                            <div className="flex-1 h-px bg-border" />
                                            <span className="text-xs text-foreground-muted">
                                                {groupedTags[letter].length} tag{groupedTags[letter].length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {groupedTags[letter].map((tag: TagItem) => (
                                                <div
                                                    key={tag.id}
                                                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-background-subtle transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div 
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: tag.color || PRESET_COLORS[0] }}
                                                        />
                                                        <span className="font-medium text-foreground">{tag.name}</span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {tag.documentCount || 0}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => handleOpenEdit(tag)}
                                                        >
                                                            <Edit3 className="w-3 h-3" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => deleteMutation.mutate(tag.id)}
                                                            className="hover:text-error"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showCreateModal || !!editingTag}
                onClose={() => {
                    setShowCreateModal(false);
                    setEditingTag(null);
                    resetForm();
                }}
                title={editingTag ? 'Edit Tag' : 'Create Tag'}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="tagName">Name</Label>
                        <Input
                            id="tagName"
                            placeholder="e.g., urgent, review, approved"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                            leftIcon={Hash}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            Color
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map((color, index) => (
                                <button
                                    key={`${color}-${index}`}
                                    onClick={() => setTagColor(color)}
                                    className={`
                                        w-8 h-8 rounded-lg transition-all
                                        ${tagColor === color 
                                            ? 'ring-2 ring-offset-2 ring-primary scale-110' 
                                            : 'hover:scale-105'
                                        }
                                    `}
                                    style={{ backgroundColor: color }}
                                >
                                    {tagColor === color && (
                                        <CheckCircle2 className="w-4 h-4 text-white mx-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-background-subtle rounded-lg">
                        <p className="text-xs text-foreground-muted mb-2">Preview</p>
                        <Badge
                            style={{ 
                                backgroundColor: `${tagColor}20`,
                                color: tagColor,
                                borderColor: `${tagColor}40`
                            }}
                        >
                            <span 
                                className="w-2 h-2 rounded-full mr-1.5"
                                style={{ backgroundColor: tagColor }}
                            />
                            {tagName || 'Tag Name'}
                        </Badge>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowCreateModal(false);
                                setEditingTag(null);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="gradient" 
                            onClick={handleSubmit}
                            disabled={!tagName || createMutation.isPending || updateMutation.isPending}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editingTag ? 'Save Changes' : 'Create Tag'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
