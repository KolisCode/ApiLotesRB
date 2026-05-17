import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { CreateLoteDto, UpdateLoteDto } from './lotes.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('lotes')
export class LotesController {
  constructor(private readonly service: LotesService) {}

  @Get()
  findAll(@Query('estado') estado?: string) {
    return this.service.findAll(estado);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  stats() {
    return this.service.stats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateLoteDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLoteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
