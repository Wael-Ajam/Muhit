import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ───── Public endpoints ─────

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('published') published?: string,
  ) {
    const isPublished =
      published === 'true' ? true : published === 'false' ? false : undefined;
    return this.projectsService.findAll(category, isPublished);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('export')
  exportForFrontend() {
    return this.projectsService.exportForFrontend();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  // ───── Protected endpoints ─────

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('reorder')
  reorder(@Body('orderedIds') orderedIds: number[]) {
    return this.projectsService.reorder(orderedIds);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }

  // ───── Gallery endpoints (Protected) ─────

  @UseGuards(JwtAuthGuard)
  @Post(':id/gallery')
  addGalleryItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateGalleryItemDto,
  ) {
    return this.projectsService.addGalleryItem(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/gallery/:itemId')
  removeGalleryItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.projectsService.removeGalleryItem(id, itemId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/gallery/reorder')
  reorderGallery(
    @Param('id', ParseIntPipe) id: number,
    @Body('orderedIds') orderedIds: number[],
  ) {
    return this.projectsService.reorderGallery(id, orderedIds);
  }
}
