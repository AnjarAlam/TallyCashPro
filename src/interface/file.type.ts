export interface S3UploadResponse {
    data: {
        url: string;
        key: string;
        fileType: 'image' | 'video' | 'document' | 'other';
        mimeType: string;
        size: number;
    };
    message: string;
}

export interface S3UploadPayload {
    file: File;
    folder?: string;
    url?: string;
    // Add any additional parameters your API might need
    // companyId?: string;
    // ... other possible payload fields
}
