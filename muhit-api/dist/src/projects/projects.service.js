"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const media_service_1 = require("../media/media.service");
let ProjectsService = class ProjectsService {
    prisma;
    mediaService;
    constructor(prisma, mediaService) {
        this.prisma = prisma;
        this.mediaService = mediaService;
    }
    includeRelations = {
        tags: { select: { id: true, tagKey: true } },
        gallery: {
            select: { id: true, type: true, src: true, layout: true, sortOrder: true },
            orderBy: { sortOrder: 'asc' },
        },
    };
    async findAll(category, published) {
        const where = {};
        if (category)
            where.category = category;
        if (published !== undefined)
            where.isPublished = published;
        return this.prisma.project.findMany({
            where,
            include: this.includeRelations,
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findOne(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: this.includeRelations,
        });
        if (!project) {
            throw new common_1.NotFoundException(`المشروع #${id} غير موجود`);
        }
        return project;
    }
    async findBySlug(slug) {
        const project = await this.prisma.project.findUnique({
            where: { slug },
            include: this.includeRelations,
        });
        if (!project) {
            throw new common_1.NotFoundException(`المشروع "${slug}" غير موجود`);
        }
        return project;
    }
    async create(dto) {
        const existing = await this.prisma.project.findUnique({
            where: { slug: dto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException(`الـ slug "${dto.slug}" مستخدم مسبقاً`);
        }
        const { tags, ...projectData } = dto;
        return this.prisma.project.create({
            data: {
                ...projectData,
                isVideo: projectData.isVideo ?? false,
                sortOrder: projectData.sortOrder ?? 0,
                isPublished: projectData.isPublished ?? true,
                isFeatured: projectData.isFeatured ?? false,
                longDescAr: projectData.longDescAr ?? '',
                longDescEn: projectData.longDescEn ?? '',
                storyP2Ar: projectData.storyP2Ar ?? '',
                storyP2En: projectData.storyP2En ?? '',
                storyP3Ar: projectData.storyP3Ar ?? '',
                storyP3En: projectData.storyP3En ?? '',
                tags: tags?.length
                    ? { create: tags.map((tagKey) => ({ tagKey })) }
                    : undefined,
            },
            include: this.includeRelations,
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        const { tags, ...projectData } = dto;
        if (tags !== undefined) {
            await this.prisma.projectTag.deleteMany({ where: { projectId: id } });
        }
        return this.prisma.project.update({
            where: { id },
            data: {
                ...projectData,
                tags: tags !== undefined
                    ? { create: tags.map((tagKey) => ({ tagKey })) }
                    : undefined,
            },
            include: this.includeRelations,
        });
    }
    async remove(id) {
        const project = await this.findOne(id);
        await this.mediaService.deleteProjectFiles(project.slug);
        await this.prisma.project.delete({ where: { id } });
        return { message: `تم حذف المشروع #${id} بنجاح` };
    }
    async reorder(orderedIds) {
        const updates = orderedIds.map((id, index) => this.prisma.project.update({
            where: { id },
            data: { sortOrder: index },
        }));
        await this.prisma.$transaction(updates);
        return { message: 'تم إعادة الترتيب بنجاح' };
    }
    async addGalleryItem(projectId, dto) {
        await this.findOne(projectId);
        const maxItem = await this.prisma.galleryItem.findFirst({
            where: { projectId },
            orderBy: { sortOrder: 'desc' },
        });
        return this.prisma.galleryItem.create({
            data: {
                projectId,
                type: dto.type,
                src: dto.src,
                layout: dto.layout ?? 'full',
                sortOrder: dto.sortOrder ?? (maxItem ? maxItem.sortOrder + 1 : 0),
                width: dto.width ?? 0,
                height: dto.height ?? 0,
                aspectRatio: dto.aspectRatio ?? 1.0,
            },
        });
    }
    async removeGalleryItem(projectId, itemId) {
        const item = await this.prisma.galleryItem.findFirst({
            where: { id: itemId, projectId },
        });
        if (!item) {
            throw new common_1.NotFoundException(`عنصر المعرض #${itemId} غير موجود`);
        }
        await this.prisma.galleryItem.delete({ where: { id: itemId } });
        return { message: `تم حذف عنصر المعرض #${itemId}` };
    }
    async reorderGallery(projectId, orderedIds) {
        await this.findOne(projectId);
        const updates = orderedIds.map((id, index) => this.prisma.galleryItem.update({
            where: { id },
            data: { sortOrder: index },
        }));
        await this.prisma.$transaction(updates);
        return { message: 'تم ترتيب المعرض بنجاح' };
    }
    async exportForFrontend() {
        const dbProjects = await this.prisma.project.findMany({
            include: {
                tags: { select: { tagKey: true } },
                gallery: {
                    select: { type: true, src: true, layout: true, sortOrder: true, width: true, height: true, aspectRatio: true },
                    orderBy: { sortOrder: 'asc' },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
        const projects = dbProjects.map((p, index) => {
            const num = index + 1;
            return {
                id: p.id,
                slug: p.slug,
                category: p.category,
                image: p.coverImage,
                video: p.coverVideo,
                isVideo: p.isVideo,
                titleKey: `project${num}Title`,
                descKey: `project${num}Desc`,
                longDescKey: `project${num}LongDesc`,
                storyPara2Key: `project${num}StoryPara2`,
                storyPara3Key: `project${num}StoryPara3`,
                tagKeys: p.tags.map((t) => t.tagKey),
                websiteUrl: p.websiteUrl || undefined,
                gallery: p.gallery.map((g) => ({
                    type: g.type,
                    src: g.src,
                    layout: g.layout,
                    width: g.width,
                    height: g.height,
                    aspectRatio: g.aspectRatio,
                })),
            };
        });
        const messagesAr = {};
        const messagesEn = {};
        dbProjects.forEach((p, index) => {
            const num = index + 1;
            messagesAr[`project${num}Title`] = p.titleAr;
            messagesAr[`project${num}Desc`] = p.descAr;
            messagesAr[`project${num}LongDesc`] = p.longDescAr;
            messagesAr[`project${num}StoryPara2`] = p.storyP2Ar;
            messagesAr[`project${num}StoryPara3`] = p.storyP3Ar;
            messagesEn[`project${num}Title`] = p.titleEn;
            messagesEn[`project${num}Desc`] = p.descEn;
            messagesEn[`project${num}LongDesc`] = p.longDescEn;
            messagesEn[`project${num}StoryPara2`] = p.storyP2En;
            messagesEn[`project${num}StoryPara3`] = p.storyP3En;
        });
        return {
            projects,
            messages: { ar: messagesAr, en: messagesEn },
        };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        media_service_1.MediaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map