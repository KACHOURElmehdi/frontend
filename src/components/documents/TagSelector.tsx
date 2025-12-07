'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Misc';
import { Search, Tag as TagIcon, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface Tag {
    id: number;
    name: string;
    color?: string;
}

interface TagSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTag: (tagId: number) => void;
    selectedTagIds: number[];
}

export default function TagSelector({ isOpen, onClose, onSelectTag, selectedTagIds }: TagSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: tags, isLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await apiClient.get('/tags');
            return response.data;
        },
        enabled: isOpen,
    });

    const filteredTags = tags?.filter((tag: Tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Tags" size="md">
            <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                    <Input
                        placeholder="Search tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Tags List */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                    {isLoading ? (
                        <div className="py-8 flex justify-center">
                            <Spinner size="md" />
                        </div>
                    ) : filteredTags.length === 0 ? (
                        <div className="py-8 text-center">
                            <TagIcon className="w-12 h-12 mx-auto mb-2 text-foreground-muted" />
                            <p className="text-foreground-muted">
                                {searchQuery ? 'No tags found' : 'No tags available'}
                            </p>
                        </div>
                    ) : (
                        filteredTags.map((tag: Tag) => {
                            const isSelected = selectedTagIds.includes(tag.id);
                            return (
                                <button
                                    key={tag.id}
                                    onClick={() => onSelectTag(tag.id)}
                                    disabled={isSelected}
                                    className={`
                                        w-full flex items-center justify-between p-3 rounded-lg border
                                        transition-all duration-200
                                        ${isSelected
                                            ? 'bg-primary/10 border-primary cursor-not-allowed'
                                            : 'bg-background hover:bg-background-subtle border-border hover:border-primary'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        {tag.color && (
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: tag.color }}
                                            />
                                        )}
                                        <span className="font-medium">{tag.name}</span>
                                    </div>
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                    <Button variant="outline" onClick={onClose}>
                        Done
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
