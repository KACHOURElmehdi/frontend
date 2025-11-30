'use client';

import React from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { Tag } from '@/types';

interface TagListProps {
    tags: Tag[];
}

export default function TagList({ tags }: TagListProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                >
                    <TagIcon className="w-3 h-3 mr-2" />
                    <span className="font-semibold mr-1">{tag.key}:</span>
                    {tag.value}
                </span>
            ))}
        </div>
    );
}
