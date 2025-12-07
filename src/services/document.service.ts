import api from './api';
import { Document, SearchParams, SearchResponse, Category } from '../types';

export const uploadDocument = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<Document>('/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getAllDocuments = async () => {
    const response = await api.get<Document[]>('/documents');
    return response.data;
};

export const getDocument = async (id: number) => {
    const response = await api.get<Document>(`/documents/${id}`);
    return response.data;
};

export const getDocumentFile = async (id: number) => {
    const response = await api.get(`/documents/${id}/file`, {
        responseType: 'blob',
    });
    return response.data;
};

export const searchDocuments = async (params: SearchParams) => {
    // Convert 'limit' to 'size' for Spring Pageable
    const apiParams: Record<string, any> = { ...params };
    if (apiParams.limit !== undefined) {
        apiParams.size = apiParams.limit;
        delete apiParams.limit;
    }
    const response = await api.get<SearchResponse>('/documents/search', { params: apiParams });
    return response.data;
};

export const reclassifyDocument = async (id: number, categoryId: number) => {
    const response = await api.post<Document>(`/documents/${id}/reclassify`, { categoryId });
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
};

export const deleteDocument = async (id: number) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
};

export const getRecentDocuments = async (limit: number = 10) => {
    const response = await api.get<Document[]>('/documents', {
        params: { size: limit, sort: 'uploadedAt,desc' }
    });
    return response.data;
};
