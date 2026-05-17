import { Controller, Post, Get, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './contacto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contacto')
export class ContactoController {
  constructor(private readonly service: ContactoService) {}

  @Post()
  async create(@Body() dto: CreateContactoDto) {
    const contacto = await this.service.create(dto);
    return { message: 'Mensaje recibido', id: contacto.id };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('noLeidos') noLeidos?: string) {
    return this.service.findAll(noLeidos === 'true');
  }

  @Patch(':id/leido')
  @UseGuards(JwtAuthGuard)
  marcarLeido(@Param('id', ParseIntPipe) id: number) {
    return this.service.marcarLeido(id);
  }
}
