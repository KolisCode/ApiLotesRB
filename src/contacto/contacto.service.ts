import { Injectable, BadRequestException } from '@nestjs/common';
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
}
