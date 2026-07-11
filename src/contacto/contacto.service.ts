import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactoDto } from './contacto.dto';

@Injectable()
export class ContactoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactoDto) {
    if (dto.loteId) {
      const lote = await this.prisma.lote.findUnique({ where: { id: dto.loteId } });
      if (!lote) throw new BadRequestException(`El lote #${dto.loteId} no existe`);
    }
    return this.prisma.contacto.create({
      data: {
        nombre:   dto.nombre,
        email:    dto.email,
        telefono: dto.telefono,
        mensaje:  dto.mensaje,
        loteId:   dto.loteId,
      },
    });
  }

  findAll(soloNoLeidos?: boolean) {
    return this.prisma.contacto.findMany({
      where: soloNoLeidos ? { leido: false } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  marcarLeido(id: number) {
    return this.prisma.contacto.update({ where: { id }, data: { leido: true } });
  }

  async remove(id: number) {
    const existe = await this.prisma.contacto.findUnique({ where: { id } });
    if (!existe) throw new NotFoundException(`Mensaje #${id} no encontrado`);
    await this.prisma.contacto.delete({ where: { id } });
    return { id };
  }
}
