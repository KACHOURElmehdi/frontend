'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { getCategories, reclassifyDocument } from '@/services/document.service';
import { Category } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ReclassifyModalProps {
    documentId: number;
    currentCategoryId?: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function ReclassifyModal({ documentId, currentCategoryId, isOpen, onClose }: ReclassifyModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(currentCategoryId);
    const queryClient = useQueryClient();

    // Reset selected category when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedCategory(currentCategoryId);
        }
    }, [isOpen, currentCategoryId]);

    const { data: categories, isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        enabled: isOpen,
    });

    const mutation = useMutation({
        mutationFn: (categoryId: number) => reclassifyDocument(documentId, categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document', documentId] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
            onClose();
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Reclassify Document</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">
                        Select the correct category for this document. This will trigger a re-evaluation of the document's metadata.
                    </p>

                    {isLoadingCategories ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {categories?.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${selectedCategory === category.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="font-medium">{category.name}</span>
                                    {selectedCategory === category.id && (
                                        <Check className="w-4 h-4 text-blue-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => selectedCategory && mutation.mutate(selectedCategory)}
                        disabled={!selectedCategory || mutation.isPending || selectedCategory === currentCategoryId}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        Confirm Reclassification
                    </button>
                </div>
            </div>
        </div>
    );
}
