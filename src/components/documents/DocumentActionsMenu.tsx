'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, Download, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface DocumentActionsMenuProps {
    documentId: number;
    onDownload?: () => void;
    onDelete?: () => void;
    viewHref?: string;
    downloading?: boolean;
    deleting?: boolean;
}

export default function DocumentActionsMenu({
    documentId,
    onDownload,
    onDelete,
    viewHref,
    downloading = false,
    deleting = false,
}: DocumentActionsMenuProps) {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (!open) {
            return;
        }
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const handleToggle = () => setOpen(prev => !prev);
    const handleDownloadClick = () => {
        if (onDownload) {
            onDownload();
        }
        setOpen(false);
    };

    const handleDeleteClick = () => {
        if (onDelete) {
            onDelete();
        }
        setOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <Button variant="ghost" size="sm" onClick={handleToggle} aria-label={`Document ${documentId} actions`}>
                <MoreHorizontal className="w-4 h-4" />
            </Button>
            {open && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
                    {viewHref && (
                        <Link
                            href={viewHref}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View details
                        </Link>
                    )}
                    {onDownload && (
                        <button
                            type="button"
                            onClick={handleDownloadClick}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            disabled={downloading}
                        >
                            <Download className="w-4 h-4" />
                            {downloading ? 'Downloading…' : 'Download'}
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={handleDeleteClick}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                            disabled={deleting}
                        >
                            <Trash2 className="w-4 h-4" />
                            {deleting ? 'Deleting…' : 'Delete'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
