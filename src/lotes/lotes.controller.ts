import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LotesService } from './lotes.service';
import { CreateLoteDto, UpdateLoteDto } from './lotes.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Lotes')
@Controller('lotes')
export class LotesController {
  constructor(private readonly service: LotesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar lotes', description: 'Devuelve todos los lotes, opcionalmente filtrados por estado' })
  @ApiQuery({ name: 'estado', required: false, enum: ['disponible', 'reservado', 'vendido'] })
  @ApiResponse({ status: 200, description: 'Lista de lotes' })
  findAll(@Query('estado') estado?: string) {
    return this.service.findAll(estado);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Estadísticas del catálogo (admin)' })
  @ApiResponse({ status: 200, description: 'Totales por estado y precio promedio' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  stats() {
    return this.service.stats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener lote por ID' })
  @ApiResponse({ status: 200, description: 'Detalle del lote' })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear lote (admin)' })
  @ApiResponse({ status: 201, description: 'Lote creado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() dto: CreateLoteDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar lote (admin)' })
  @ApiResponse({ status: 200, description: 'Lote actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLoteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar lote (admin)' })
  @ApiResponse({ status: 200, description: 'Lote eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
