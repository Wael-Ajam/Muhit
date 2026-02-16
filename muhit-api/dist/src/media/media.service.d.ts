interface UploadedFile {
    originalname: string;
    buffer: Buffer;
}
export declare class MediaService {
    private readonly uploadBase;
    constructor();
    uploadFile(file: UploadedFile, projectSlug?: string): Promise<{
        url: string;
        originalName: string;
        width: number;
        height: number;
    }>;
    deleteFile(filePath: string): {
        message: string;
    };
    listFiles(projectSlug: string): string[];
    deleteProjectFiles(projectSlug: string): void;
}
export {};
