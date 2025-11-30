'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import DocumentList from '@/components/documents/DocumentList';
import { useQuery } from '@tanstack/react-query';
import { searchDocuments, getCategories } from '@/services/document.service';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const debouncedQuery = useDebounce(query, 500);

    // Reset page when filters change
    React.useEffect(() => {
        setPage(0);
    }, [debouncedQuery, category]);

    const { data: searchData, isLoading } = useQuery({
        queryKey: ['documents', 'search', debouncedQuery, category, page],
        queryFn: () => searchDocuments({
            q: debouncedQuery,
            category: category || undefined,
            page,
            limit: pageSize,
        }),
        placeholderData: (previousData) => previousData,
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto py-10 px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Search Documents</h1>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, content..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white w-full sm:w-48"
                            >
                                <option value="">All Categories</option>
                                {categories?.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <DocumentList
                    documents={searchData?.content || []}
                    loading={isLoading}
                />

                {/* Pagination */}
                {searchData && searchData.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0 || isLoading}
                            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {page + 1} of {searchData.totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(searchData.totalPages - 1, p + 1))}
                            disabled={page >= searchData.totalPages - 1 || isLoading}
                            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

