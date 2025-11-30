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
    const response = await api.get<SearchResponse>('/documents/search', { params });
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
