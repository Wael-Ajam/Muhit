import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { InboxService } from './inbox.service';
import { CreateInboxMessageDto } from './dto/create-inbox-message.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  // Public — receives form submissions
  @Post()
  create(@Body() dto: CreateInboxMessageDto) {
    return this.inboxService.create(dto);
  }

  // Protected — admin only
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Query('filter') filter?: string) {
    return this.inboxService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('unread-count')
  getUnreadCount() {
    return this.inboxService.getUnreadCount();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.inboxService.markAsRead(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/star')
  toggleStar(@Param('id', ParseIntPipe) id: number) {
    return this.inboxService.toggleStar(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.inboxService.delete(id);
  }
}
