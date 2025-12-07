'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner, EmptyState } from '@/components/ui/Misc';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories } from '@/services/document.service';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import {
    FolderOpen,
    Plus,
    Edit3,
    Trash2,
    Search,
    FileText,
    CheckCircle2,
    Palette,
    Users
} from 'lucide-react';
import { Category as BaseCategory } from '@/types';

interface Category extends Omit<BaseCategory, 'id'> {
    id: number;
    color?: string;
    documentCount?: number;
}

const PRESET_COLORS = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'
];

export default function CategoriesPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryColor, setCategoryColor] = useState(PRESET_COLORS[0]);
    const { isAdmin, loading: authLoading } = useAuth();
    const layoutConfig = {
        title: 'Categories',
        description: 'Manage document classification categories',
        breadcrumbs: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Categories', href: '/categories', current: true },
        ] as const,
    };

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        enabled: !authLoading,
    });
    const isFetching = !authLoading && isLoading;

    const createMutation = useMutation({
        mutationFn: (data: { name: string; description?: string; color?: string }) => 
            apiClient.post('/categories', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setShowCreateModal(false);
            resetForm();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: { name: string; description?: string; color?: string } }) => 
            apiClient.put(`/categories/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setEditingCategory(null);
            resetForm();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiClient.delete(`/categories/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    const resetForm = () => {
        setCategoryName('');
        setCategoryDescription('');
        setCategoryColor(PRESET_COLORS[0]);
    };

    const handleOpenCreate = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const handleOpenEdit = (category: Category) => {
        setCategoryName(category.name);
        setCategoryDescription(category.description || '');
        setCategoryColor(category.color || PRESET_COLORS[0]);
        setEditingCategory(category);
    };

    const handleSubmit = () => {
        const data = {
            name: categoryName,
            description: categoryDescription || undefined,
            color: categoryColor,
        };

        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const filteredCategories = categories?.filter((cat: Category) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (authLoading) {
        return (
            <DashboardLayout {...layoutConfig}>
                <Card>
                    <CardContent className="py-12">
                        <Spinner size="lg" label="Loading..." className="mx-auto" />
                    </CardContent>
                </Card>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout {...layoutConfig}>
            <div className="space-y-6">
                {/* Admin Analytics */}
                {isAdmin && !isFetching && categories && categories.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card variant="glass">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <FolderOpen className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                                        <p className="text-sm text-foreground-muted">Total Categories</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card variant="glass">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-success" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            {new Set(categories.filter((c: Category) => c.createdByUserId).map((c: Category) => c.createdByUserId)).size}
                                        </p>
                                        <p className="text-sm text-foreground-muted">Contributors</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card variant="glass">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            {categories.reduce((sum: number, c: Category) => sum + (c.documentCount || 0), 0)}
                                        </p>
                                        <p className="text-sm text-foreground-muted">Categorized Docs</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                        <Input
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button variant="gradient" onClick={handleOpenCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Category
                    </Button>
                </div>

                {/* Categories Grid */}
                {isFetching ? (
                    <Card>
                        <CardContent className="py-12">
                            <Spinner size="lg" label="Loading categories..." className="mx-auto" />
                        </CardContent>
                    </Card>
                ) : filteredCategories.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <EmptyState
                                icon={<FolderOpen className="w-8 h-8" />}
                                title={searchQuery ? "No categories found" : "No categories yet"}
                                description={searchQuery 
                                    ? "Try adjusting your search" 
                                    : "Create your first category to organize documents"
                                }
                                action={
                                    !searchQuery && (
                                        <Button variant="gradient" onClick={handleOpenCreate}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Category
                                        </Button>
                                    )
                                }
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCategories.map((category: Category) => (
                            <Card 
                                key={category.id} 
                                variant="interactive"
                                className="group"
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: `${category.color || PRESET_COLORS[0]}20` }}
                                            >
                                                <FolderOpen 
                                                    className="w-6 h-6" 
                                                    style={{ color: category.color || PRESET_COLORS[0] }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {category.name}
                                                </h3>
                                                <p className="text-xs text-foreground-muted flex items-center gap-1">
                                                    <FileText className="w-3 h-3" />
                                                    {category.documentCount || 0} documents
                                                </p>
                                                {isAdmin && category.createdByUsername && (
                                                    <p className="text-xs text-foreground-muted mt-0.5">
                                                        Created by: {category.createdByUsername}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {isAdmin && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleOpenEdit(category)}
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => deleteMutation.mutate(category.id)}
                                                    className="hover:text-error"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {category.description && (
                                        <p className="text-sm text-foreground-muted line-clamp-2">
                                            {category.description}
                                        </p>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                                        <div 
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: category.color || PRESET_COLORS[0] }}
                                        />
                                        <Badge variant="secondary" className="text-xs">
                                            Active
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Stats Footer */}
                {!isFetching && filteredCategories.length > 0 && (
                    <Card variant="glass">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-foreground-muted">
                                    {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
                                </span>
                                <span className="text-foreground-muted">
                                    {filteredCategories.reduce((sum: number, cat: Category) => sum + (cat.documentCount || 0), 0)} total documents
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showCreateModal || !!editingCategory}
                onClose={() => {
                    setShowCreateModal(false);
                    setEditingCategory(null);
                    resetForm();
                }}
                title={editingCategory ? 'Edit Category' : 'Create Category'}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="categoryName">Name</Label>
                        <Input
                            id="categoryName"
                            placeholder="e.g., Invoices, Contracts, Reports"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            leftIcon={FolderOpen}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryDescription">Description (optional)</Label>
                        <Input
                            id="categoryDescription"
                            placeholder="Brief description of this category"
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
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
                                    onClick={() => setCategoryColor(color)}
                                    className={`
                                        w-8 h-8 rounded-lg transition-all
                                        ${categoryColor === color 
                                            ? 'ring-2 ring-offset-2 ring-primary scale-110' 
                                            : 'hover:scale-105'
                                        }
                                    `}
                                    style={{ backgroundColor: color }}
                                >
                                    {categoryColor === color && (
                                        <CheckCircle2 className="w-4 h-4 text-white mx-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowCreateModal(false);
                                setEditingCategory(null);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="gradient" 
                            onClick={handleSubmit}
                            disabled={!categoryName || createMutation.isPending || updateMutation.isPending}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editingCategory ? 'Save Changes' : 'Create Category'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
