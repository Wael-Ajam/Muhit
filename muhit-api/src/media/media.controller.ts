import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer'; // Required for Express.Multer.File type
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('projectSlug') projectSlug: string,
  ) {
    return this.mediaService.uploadFile(file, projectSlug);
  }

  @Delete('file')
  deleteFile(@Body('filePath') filePath: string) {
    return this.mediaService.deleteFile(filePath);
  }

  @Get('list/:projectSlug')
  listFiles(@Param('projectSlug') projectSlug: string) {
    return this.mediaService.listFiles(projectSlug);
  }
}
