import {
  Controller, Post, UploadedFile, UseGuards, UseInterceptors,
  BadRequestException, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {

  @Post('imagen')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir imagen de lote (admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiResponse({ status: 201, description: 'URL de la imagen subida', schema: { example: { url: 'https://lotesrb.koliscode.com/uploads/lote-123.jpg' } } })
  @ApiResponse({ status: 400, description: 'Archivo inválido o ausente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `lote-${unique}${extname(file.originalname).toLowerCase()}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        return cb(new BadRequestException('Solo se permiten imágenes JPG, PNG o WebP'), false);
      }
      cb(null, true);
    },
  }))
  uploadImagen(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return { url: `${baseUrl}/uploads/${file.filename}` };
  }
}
