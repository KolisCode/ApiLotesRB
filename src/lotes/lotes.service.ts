import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EstadoLote } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoteDto, UpdateLoteDto } from './lotes.dto';

@Injectable()
export class LotesService {
  constructor(private prisma: PrismaService) {}

  private readonly publicSelect = {
    id: true, numero: true, manzana: true, area: true, precio: true,
    ubicacion: true, estado: true, descripcion: true, imagen: true,
    latitud: true, longitud: true,
    servicios: { select: { id: true, nombre: true, icono: true } },
  } as const;

  findAll(estado?: string) {
    const estadoValido =
      estado && Object.values(EstadoLote).includes(estado as EstadoLote)
        ? (estado as EstadoLote)
        : undefined;

    if (estado && !estadoValido) {
      throw new BadRequestException(`Estado inválido: ${estado}. Valores permitidos: ${Object.values(EstadoLote).join(', ')}`);
    }

    return this.prisma.lote.findMany({
      where: estadoValido ? { estado: estadoValido } : undefined,
      select: this.publicSelect,
      orderBy: [{ manzana: 'asc' }, { numero: 'asc' }],
    });
  }

  async findOne(id: number) {
    const lote = await this.prisma.lote.findUnique({
      where: { id },
      select: this.publicSelect,
    });
    if (!lote) throw new NotFoundException(`Lote #${id} no encontrado`);
    return lote;
  }

  async create(dto: CreateLoteDto) {
    const { servicios, ...data } = dto;
    return this.prisma.lote.create({
      data: {
        ...data,
        servicios: servicios ? { create: servicios } : undefined,
      },
      select: this.publicSelect,
    });
  }

  async update(id: number, dto: UpdateLoteDto) {
    await this.findOne(id);
    const { servicios, ...data } = dto;
    return this.prisma.lote.update({
      where: { id },
      data: {
        ...data,
        servicios: servicios ? { deleteMany: {}, create: servicios } : undefined,
      },
      select: this.publicSelect,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.lote.delete({ where: { id } });
    return { id };
  }

  stats() {
    return this.prisma.lote.groupBy({
      by: ['estado'],
      _count: { estado: true },
    });
  }
}
