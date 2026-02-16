import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import sharp = require('sharp');
import * as fs from 'fs';
import * as path from 'path';

interface UploadedFile {
  originalname: string;
  buffer: Buffer;
}

@Injectable()
export class MediaService {
  // Base upload directory — in the frontend's public folder (one level up from muhit-api)
  private readonly uploadBase = path.resolve(
    process.cwd(),
    '..',
    'public',
    'uploads',
  );

  constructor() {
    // Ensure base upload dir exists
    if (!fs.existsSync(this.uploadBase)) {
      fs.mkdirSync(this.uploadBase, { recursive: true });
    }
  }

  // ───── Upload + Compress ─────
  async uploadFile(
    file: UploadedFile,
    projectSlug?: string,
  ): Promise<{ url: string; originalName: string; width: number; height: number }> {
    // Create folder (use 'site' for general uploads like SEO)
    const folder = projectSlug || 'site';
    const projectDir = path.join(this.uploadBase, folder);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();

    // Check if image → compress to WebP
    const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp'];
    const videoExts = ['.mp4', '.mov', '.webm', '.avi'];
    const passthroughExts = ['.ico', '.svg'];

    if (imageExts.includes(ext)) {
      const outputName = `${baseName}-${timestamp}.webp`;
      const outputPath = path.join(projectDir, outputName);

      try {
        // Primary: resize + compress to WebP
        await sharp(file.buffer)
          .resize(1920, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outputPath);
      } catch {
        try {
          // Fallback: compress without resize
          await sharp(file.buffer)
            .webp({ quality: 80 })
            .toFile(outputPath);
        } catch {
          // Last resort: convert to PNG then to WebP
          try {
            const pngBuf = await sharp(file.buffer).png().toBuffer();
            await sharp(pngBuf)
              .webp({ quality: 80 })
              .toFile(outputPath);
          } catch {
            // Absolute last resort: save original
            const fallbackName = `${baseName}-${timestamp}${ext}`;
            const fallbackPath = path.join(projectDir, fallbackName);
            fs.writeFileSync(fallbackPath, file.buffer);
            return {
              url: `/uploads/${folder}/${fallbackName}`,
              originalName: file.originalname,
              width: 0, // No sharp processing, so no dimensions
              height: 0, // No sharp processing, so no dimensions
            };
          }
        }
      }

      // Read final dimensions
      let width = 0;
      let height = 0;
      try {
        const meta = await sharp(outputPath).metadata();
        width = meta.width || 0;
        height = meta.height || 0;
      } catch { /* ignore */ }

      return {
        url: `/uploads/${folder}/${outputName}`,
        originalName: file.originalname,
        width,
        height,
      };
    } else if (videoExts.includes(ext)) {
      // Save video as-is
      const outputName = `${baseName}-${timestamp}${ext}`;
      const outputPath = path.join(projectDir, outputName);

      fs.writeFileSync(outputPath, file.buffer);

      return {
        url: `/uploads/${folder}/${outputName}`,
        originalName: file.originalname,
        width: 0,
        height: 0,
      };
    } else if (passthroughExts.includes(ext)) {
      // Save icons/svg as-is
      const outputName = `${baseName}-${timestamp}${ext}`;
      const outputPath = path.join(projectDir, outputName);
      fs.writeFileSync(outputPath, file.buffer);
      return {
        url: `/uploads/${folder}/${outputName}`,
        originalName: file.originalname,
        width: 0,
        height: 0,
      };
    } else {
      throw new BadRequestException(
        `نوع الملف "${ext}" غير مدعوم. الأنواع المدعومة: ${[...imageExts, ...videoExts, ...passthroughExts].join(', ')}`,
      );
    }
  }

  // ───── Delete File ─────
  deleteFile(filePath: string): { message: string } {
    const fullPath = path.join(
      this.uploadBase,
      '..',
      filePath.replace(/^\/uploads/, 'uploads'),
    );

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException(`الملف غير موجود: ${filePath}`);
    }

    fs.unlinkSync(fullPath);
    return { message: `تم حذف الملف: ${filePath}` };
  }

  // ───── List Files for a Project ─────
  listFiles(projectSlug: string): string[] {
    const projectDir = path.join(this.uploadBase, projectSlug);

    if (!fs.existsSync(projectDir)) {
      return [];
    }

    return fs
      .readdirSync(projectDir)
      .map((file) => `/uploads/${projectSlug}/${file}`);
  }

  // ───── Delete All Project Files ─────
  deleteProjectFiles(projectSlug: string): void {
    const projectDir = path.join(this.uploadBase, projectSlug);

    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
  }
}
