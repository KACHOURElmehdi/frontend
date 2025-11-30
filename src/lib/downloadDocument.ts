import { apiClient } from './apiClient';

export const downloadDocument = async (documentId: number, filename: string) => {
    try {
        const response = await apiClient.get(`/documents/${documentId}/file`, {
            responseType: 'blob',
        });

        // Create a blob URL and trigger download
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading document:', error);
        throw error;
    }
};
