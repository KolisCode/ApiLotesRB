import { Controller, Post, Get, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './contacto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Contacto')
@Controller('contacto')
export class ContactoController {
  constructor(private readonly service: ContactoService) {}

  @Post()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Enviar mensaje de contacto (público)' })
  @ApiResponse({ status: 201, description: 'Mensaje recibido', schema: { example: { message: 'Mensaje recibido', id: 1 } } })
  @ApiResponse({ status: 429, description: 'Demasiados intentos' })
  async create(@Body() dto: CreateContactoDto) {
    const contacto = await this.service.create(dto);
    return { message: 'Mensaje recibido', id: contacto.id };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar mensajes de contacto (admin)' })
  @ApiQuery({ name: 'noLeidos', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de mensajes' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(@Query('noLeidos') noLeidos?: string) {
    return this.service.findAll(noLeidos === 'true');
  }

  @Patch(':id/leido')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar mensaje como leído (admin)' })
  @ApiResponse({ status: 200, description: 'Mensaje actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  marcarLeido(@Param('id', ParseIntPipe) id: number) {
    return this.service.marcarLeido(id);
  }
}
