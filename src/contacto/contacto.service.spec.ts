import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactoDto } from './contacto.dto';

describe('ContactoService', () => {
  let service: ContactoService;
  let prisma: {
    lote: { findUnique: jest.Mock };
    contacto: { create: jest.Mock; findMany: jest.Mock; update: jest.Mock; findUnique: jest.Mock; delete: jest.Mock };
  };

  const baseDto: CreateContactoDto = { nombre: 'Juan', mensaje: 'Hola' };

  beforeEach(async () => {
    prisma = {
      lote: { findUnique: jest.fn() },
      contacto: { create: jest.fn(), findMany: jest.fn(), update: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [ContactoService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(ContactoService);
  });

  it('create() rechaza un loteId inexistente con 400', async () => {
    prisma.lote.findUnique.mockResolvedValue(null);
    await expect(service.create({ ...baseDto, loteId: 999 })).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.contacto.create).not.toHaveBeenCalled();
  });

  it('create() guarda con loteId undefined cuando no se envía', async () => {
    prisma.contacto.create.mockResolvedValue({ id: 1 });
    await service.create(baseDto);
    expect(prisma.lote.findUnique).not.toHaveBeenCalled(); // no valida lote si no hay loteId
    expect(prisma.contacto.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ loteId: undefined }) }),
    );
  });

  it('findAll(true) filtra solo los no leídos', async () => {
    prisma.contacto.findMany.mockResolvedValue([]);
    await service.findAll(true);
    expect(prisma.contacto.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { leido: false } }),
    );
  });

  it('remove() lanza 404 si el mensaje no existe', async () => {
    prisma.contacto.findUnique.mockResolvedValue(null);
    await expect(service.remove(5)).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.contacto.delete).not.toHaveBeenCalled();
  });

  it('remove() borra y devuelve el id si existe', async () => {
    prisma.contacto.findUnique.mockResolvedValue({ id: 5 });
    prisma.contacto.delete.mockResolvedValue({ id: 5 });
    await expect(service.remove(5)).resolves.toEqual({ id: 5 });
    expect(prisma.contacto.delete).toHaveBeenCalledWith({ where: { id: 5 } });
  });
});
