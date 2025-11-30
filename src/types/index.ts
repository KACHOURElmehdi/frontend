export interface Document {
    id: number;
    originalFilename: string;
    filename: string;
    contentType: string;
    size: number;
    status: 'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'ERROR';
    confidence?: number;
    modelVersion?: string;
    category?: Category;
    extractedText?: string;
    tags?: Tag[];
    uploadedAt: string;
    processedAt?: string;
    errorMessage?: string;
    storagePath?: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Tag {
    id: number;
    key: string;
    value: string;
    valueType: 'STRING' | 'NUMBER' | 'DATE' | 'ENTITY';
    confidence?: number;
}

export interface PipelineEvent {
    type: 'PROCESS_START' | 'OCR_DONE' | 'CLASSIFIED' | 'TAGGED' | 'PROCESS_COMPLETE' | 'PROCESS_ERROR';
    timestamp: string;
    payload?: any;
}

export interface User {
    id: number;
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface StatsOverview {
    totalDocuments: number;
    processedDocuments: number;
    errorDocuments: number;
    averageConfidence: number;
}

export interface CategoryStat {
    category: string;
    count: number;
}

export interface SearchParams {
    q?: string;
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
}

export interface SearchResponse {
    content: Document[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
}
