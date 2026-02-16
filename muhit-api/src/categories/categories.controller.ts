import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Public
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // Protected
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: { slug: string; nameAr: string; nameEn: string; sortOrder?: number },
  ) {
    return this.categoriesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { slug?: string; nameAr?: string; nameEn?: string; sortOrder?: number },
  ) {
    return this.categoriesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
