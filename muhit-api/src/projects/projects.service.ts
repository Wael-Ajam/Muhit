import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
import { MediaService } from '../media/media.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private mediaService: MediaService,
  ) {}

  // Include relations in queries
  private readonly includeRelations = {
    tags: { select: { id: true, tagKey: true } },
    gallery: {
      select: { id: true, type: true, src: true, layout: true, sortOrder: true },
      orderBy: { sortOrder: 'asc' as const },
    },
    categories: { select: { id: true, categorySlug: true } },
  };

  // ───── Find All ─────
  async findAll(category?: string, published?: boolean) {
    const where: Prisma.ProjectWhereInput = {};
    if (category) where.categories = { some: { categorySlug: category } };
    if (published !== undefined) where.isPublished = published;

    return this.prisma.project.findMany({
      where,
      include: this.includeRelations,
      orderBy: { sortOrder: 'asc' },
    });
  }

  // ───── Find One by ID ─────
  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: this.includeRelations,
    });

    if (!project) {
      throw new NotFoundException(`المشروع #${id} غير موجود`);
    }

    return project;
  }

  // ───── Find by Slug ─────
  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: this.includeRelations,
    });

    if (!project) {
      throw new NotFoundException(`المشروع "${slug}" غير موجود`);
    }

    return project;
  }

  // ───── Create ─────
  async create(dto: CreateProjectDto) {
    // Check slug uniqueness
    const existing = await this.prisma.project.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(`الـ slug "${dto.slug}" مستخدم مسبقاً`);
    }

    const { tags, categories, ...projectData } = dto;

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
        categories: categories?.length
          ? { create: categories.map((slug) => ({ categorySlug: slug })) }
          : undefined,
      },
      include: this.includeRelations,
    });
  }

  // ───── Update ─────
  async update(id: number, dto: UpdateProjectDto) {
    await this.findOne(id); // throws if not found

    const { tags, categories, ...projectData } = dto as CreateProjectDto;

    // If tags are provided, replace them all
    if (tags !== undefined) {
      await this.prisma.projectTag.deleteMany({ where: { projectId: id } });
    }

    // If categories are provided, replace them all
    if (categories !== undefined) {
      await this.prisma.projectCategory.deleteMany({ where: { projectId: id } });
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        tags:
          tags !== undefined
            ? { create: tags.map((tagKey: string) => ({ tagKey })) }
            : undefined,
        categories:
          categories !== undefined
            ? { create: categories.map((slug: string) => ({ categorySlug: slug })) }
            : undefined,
      },
      include: this.includeRelations,
    });
  }

  // ───── Delete ─────
  async remove(id: number) {
    const project = await this.findOne(id); // throws if not found

    // Delete uploaded media files for this project
    await this.mediaService.deleteProjectFiles(project.slug);

    await this.prisma.project.delete({ where: { id } });
    return { message: `تم حذف المشروع #${id} بنجاح` };
  }

  // ───── Reorder Projects ─────
  async reorder(orderedIds: number[]) {
    const updates = orderedIds.map((id, index) =>
      this.prisma.project.update({
        where: { id },
        data: { sortOrder: index },
      }),
    );

    await this.prisma.$transaction(updates);
    return { message: 'تم إعادة الترتيب بنجاح' };
  }

  // ───── Gallery: Add Item ─────
  async addGalleryItem(projectId: number, dto: CreateGalleryItemDto) {
    await this.findOne(projectId); // throws if not found

    // Get max sort order
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

  // ───── Gallery: Remove Item ─────
  async removeGalleryItem(projectId: number, itemId: number) {
    const item = await this.prisma.galleryItem.findFirst({
      where: { id: itemId, projectId },
    });

    if (!item) {
      throw new NotFoundException(`عنصر المعرض #${itemId} غير موجود`);
    }

    await this.prisma.galleryItem.delete({ where: { id: itemId } });
    return { message: `تم حذف عنصر المعرض #${itemId}` };
  }

  // ───── Gallery: Reorder ─────
  async reorderGallery(projectId: number, orderedIds: number[]) {
    await this.findOne(projectId); // throws if not found

    const updates = orderedIds.map((id, index) =>
      this.prisma.galleryItem.update({
        where: { id },
        data: { sortOrder: index },
      }),
    );

    await this.prisma.$transaction(updates);
    return { message: 'تم ترتيب المعرض بنجاح' };
  }

  // ───── Export for Frontend ─────
  async exportForFrontend() {
    const dbProjects = await this.prisma.project.findMany({
      include: {
        tags: { select: { tagKey: true } },
        gallery: {
          select: { type: true, src: true, layout: true, sortOrder: true, width: true, height: true, aspectRatio: true },
          orderBy: { sortOrder: 'asc' },
        },
        categories: { select: { categorySlug: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Build the frontend-compatible projects array + i18n messages
    const projects = dbProjects.map((p, index) => {
      const num = index + 1;
      return {
        id: p.id,
        slug: p.slug,
        category: p.category,
        categories: p.categories.map((c) => c.categorySlug),
        image: p.coverImage,
        video: p.coverVideo,
        isVideo: p.isVideo,
        logo: p.logo || null,
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

    // Build i18n messages
    const messagesAr: Record<string, string> = {};
    const messagesEn: Record<string, string> = {};

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
}
