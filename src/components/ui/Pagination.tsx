'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingsCount?: number;
    className?: string;
}

function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    siblingsCount = 1,
    className 
}: PaginationProps) {
    const range = (start: number, end: number) => {
        const length = end - start + 1;
        return Array.from({ length }, (_, i) => start + i);
    };

    const paginationRange = React.useMemo(() => {
        const totalPageNumbers = siblingsCount + 5;

        if (totalPageNumbers >= totalPages) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingsCount;
            const leftRange = range(1, leftItemCount);
            return [...leftRange, "dots", totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingsCount;
            const rightRange = range(totalPages - rightItemCount + 1, totalPages);
            return [firstPageIndex, "dots", ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, "dots", ...middleRange, "dots", lastPageIndex];
        }

        return [];
    }, [totalPages, siblingsCount, currentPage]);

    if (totalPages <= 1) return null;

    return (
        <nav className={cn("flex items-center justify-center gap-1", className)}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg border border-border text-foreground-secondary",
                    "hover:bg-secondary hover:border-border-hover transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {paginationRange.map((page, index) => {
                if (page === "dots") {
                    return (
                        <span
                            key={`dots-${index}`}
                            className="flex items-center justify-center w-9 h-9 text-foreground-muted"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </span>
                    );
                }

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        className={cn(
                            "flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                            page === currentPage
                                ? "bg-primary text-primary-foreground"
                                : "border border-border text-foreground-secondary hover:bg-secondary hover:border-border-hover"
                        )}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg border border-border text-foreground-secondary",
                    "hover:bg-secondary hover:border-border-hover transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    );
}

// Simple Pagination (Previous / Next style)
interface SimplePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

function SimplePagination({ currentPage, totalPages, onPageChange, className }: SimplePaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className={cn("flex items-center justify-between gap-4", className)}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    "border border-border text-foreground-secondary hover:bg-secondary hover:border-border-hover",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
            >
                <ChevronLeft className="w-4 h-4" />
                Previous
            </button>

            <span className="text-sm text-foreground-muted">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    "border border-border text-foreground-secondary hover:bg-secondary hover:border-border-hover",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
            >
                Next
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

export { Pagination, SimplePagination };
