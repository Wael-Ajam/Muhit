import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInboxMessageDto } from './dto/create-inbox-message.dto';

@Injectable()
export class InboxService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInboxMessageDto) {
    return this.prisma.inboxMessage.create({
      data: dto,
    });
  }

  async findAll(filter?: string) {
    const where: Record<string, unknown> = {};

    if (filter === 'unread') where.isRead = false;
    else if (filter === 'starred') where.isStarred = true;
    else if (filter === 'contact') where.type = 'contact';
    else if (filter === 'project') where.type = 'project';

    return this.prisma.inboxMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount() {
    return this.prisma.inboxMessage.count({
      where: { isRead: false },
    });
  }

  async markAsRead(id: number) {
    return this.prisma.inboxMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async toggleStar(id: number) {
    const msg = await this.prisma.inboxMessage.findUnique({ where: { id } });
    if (!msg) return null;
    return this.prisma.inboxMessage.update({
      where: { id },
      data: { isStarred: !msg.isStarred },
    });
  }

  async delete(id: number) {
    return this.prisma.inboxMessage.delete({
      where: { id },
    });
  }
}
