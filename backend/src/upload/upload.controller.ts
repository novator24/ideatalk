import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  Query, 
  UploadedFile, 
  UseInterceptors, 
  Res, 
  UseGuards,
  Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('api/admin/users')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('uploads')
  async getUserUploads(@Query('userId') userId: string, @Request() req) {
    // Отдает список всех файлов для конкретного пользователя
    return this.uploadService.getUserFilesList(userId || req.user.id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    // Загружаем файл и обрабатываем согласно схеме
    const result = await this.uploadService.processUserUploadFile(
      file, 
      req.user.id
    );
    
    // Отдаем id для дальнейшего скачивания файла с ошибками
    return { 
      uploadId: result.id,
      downloadUrl: `/api/admin/users/download/${result.id}`,
      message: 'Файл обработан, проверьте результат'
    };
  }

  @Get('download/:id')
  async downloadErrorFile(@Param('id') id: string, @Res() res: Response) {
    // FE клик по ссылке -> Отдаем файл -> Уничтожаем файл после успешного скачивания
    const fileData = await this.uploadService.getErrorFileAndDelete(id);
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileData.fileName}"`
    });

    res.send(fileData.buffer);
  }
}
