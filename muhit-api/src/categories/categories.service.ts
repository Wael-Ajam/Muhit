import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: { slug: string; nameAr: string; nameEn: string; sortOrder?: number }) {
    const exists = await this.prisma.category.findUnique({ where: { slug: data.slug } });
    if (exists) {
      throw new ConflictException(`Category with slug "${data.slug}" already exists`);
    }
    return this.prisma.category.create({ data });
  }

  async update(id: number, data: { slug?: string; nameAr?: string; nameEn?: string; sortOrder?: number }) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');

    if (data.slug && data.slug !== cat.slug) {
      const exists = await this.prisma.category.findUnique({ where: { slug: data.slug } });
      if (exists) throw new ConflictException(`Slug "${data.slug}" already in use`);
    }

    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: number) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return this.prisma.category.delete({ where: { id } });
  }
}
