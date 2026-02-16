"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const sharp = require("sharp");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let MediaService = class MediaService {
    uploadBase = path.resolve(process.cwd(), '..', 'public', 'uploads');
    constructor() {
        if (!fs.existsSync(this.uploadBase)) {
            fs.mkdirSync(this.uploadBase, { recursive: true });
        }
    }
    async uploadFile(file, projectSlug) {
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
        const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp'];
        const videoExts = ['.mp4', '.mov', '.webm', '.avi'];
        const passthroughExts = ['.ico', '.svg'];
        if (imageExts.includes(ext)) {
            const outputName = `${baseName}-${timestamp}.webp`;
            const outputPath = path.join(projectDir, outputName);
            try {
                await sharp(file.buffer)
                    .resize(1920, null, { withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(outputPath);
            }
            catch {
                try {
                    await sharp(file.buffer)
                        .webp({ quality: 80 })
                        .toFile(outputPath);
                }
                catch {
                    try {
                        const pngBuf = await sharp(file.buffer).png().toBuffer();
                        await sharp(pngBuf)
                            .webp({ quality: 80 })
                            .toFile(outputPath);
                    }
                    catch {
                        const fallbackName = `${baseName}-${timestamp}${ext}`;
                        const fallbackPath = path.join(projectDir, fallbackName);
                        fs.writeFileSync(fallbackPath, file.buffer);
                        return {
                            url: `/uploads/${folder}/${fallbackName}`,
                            originalName: file.originalname,
                            width: 0,
                            height: 0,
                        };
                    }
                }
            }
            let width = 0;
            let height = 0;
            try {
                const meta = await sharp(outputPath).metadata();
                width = meta.width || 0;
                height = meta.height || 0;
            }
            catch { }
            return {
                url: `/uploads/${folder}/${outputName}`,
                originalName: file.originalname,
                width,
                height,
            };
        }
        else if (videoExts.includes(ext)) {
            const outputName = `${baseName}-${timestamp}${ext}`;
            const outputPath = path.join(projectDir, outputName);
            fs.writeFileSync(outputPath, file.buffer);
            return {
                url: `/uploads/${folder}/${outputName}`,
                originalName: file.originalname,
                width: 0,
                height: 0,
            };
        }
        else if (passthroughExts.includes(ext)) {
            const outputName = `${baseName}-${timestamp}${ext}`;
            const outputPath = path.join(projectDir, outputName);
            fs.writeFileSync(outputPath, file.buffer);
            return {
                url: `/uploads/${folder}/${outputName}`,
                originalName: file.originalname,
                width: 0,
                height: 0,
            };
        }
        else {
            throw new common_1.BadRequestException(`نوع الملف "${ext}" غير مدعوم. الأنواع المدعومة: ${[...imageExts, ...videoExts, ...passthroughExts].join(', ')}`);
        }
    }
    deleteFile(filePath) {
        const fullPath = path.join(this.uploadBase, '..', filePath.replace(/^\/uploads/, 'uploads'));
        if (!fs.existsSync(fullPath)) {
            throw new common_1.NotFoundException(`الملف غير موجود: ${filePath}`);
        }
        fs.unlinkSync(fullPath);
        return { message: `تم حذف الملف: ${filePath}` };
    }
    listFiles(projectSlug) {
        const projectDir = path.join(this.uploadBase, projectSlug);
        if (!fs.existsSync(projectDir)) {
            return [];
        }
        return fs
            .readdirSync(projectDir)
            .map((file) => `/uploads/${projectSlug}/${file}`);
    }
    deleteProjectFiles(projectSlug) {
        const projectDir = path.join(this.uploadBase, projectSlug);
        if (fs.existsSync(projectDir)) {
            fs.rmSync(projectDir, { recursive: true, force: true });
        }
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MediaService);
//# sourceMappingURL=media.service.js.map