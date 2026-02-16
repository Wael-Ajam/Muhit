import 'multer';
import { MediaService } from './media.service';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    upload(file: Express.Multer.File, projectSlug: string): Promise<{
        url: string;
        originalName: string;
        width: number;
        height: number;
    }>;
    deleteFile(filePath: string): {
        message: string;
    };
    listFiles(projectSlug: string): string[];
}
