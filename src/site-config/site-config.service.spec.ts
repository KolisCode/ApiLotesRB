import { Test } from '@nestjs/testing';
import { SiteConfigService } from './site-config.service';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_SITE_CONFIG } from './site-config.defaults';

describe('SiteConfigService', () => {
  let service: SiteConfigService;
  let prisma: { siteConfig: { findUnique: jest.Mock; upsert: jest.Mock } };

  beforeEach(async () => {
    prisma = { siteConfig: { findUnique: jest.fn(), upsert: jest.fn() } };
    const moduleRef = await Test.createTestingModule({
      providers: [SiteConfigService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(SiteConfigService);
  });

  it('get() devuelve una COPIA de los defaults cuando no existe la fila', async () => {
    prisma.siteConfig.findUnique.mockResolvedValue(null);
    const cfg = await service.get();
    expect(cfg).not.toBe(DEFAULT_SITE_CONFIG);           // no expone el objeto mutable
    expect(cfg).toMatchObject({ marca: DEFAULT_SITE_CONFIG.marca });
    expect(cfg).toHaveProperty('updatedAt', null);       // misma forma que la fila real
  });

  it('get() devuelve la fila existente si existe', async () => {
    const row = { ...DEFAULT_SITE_CONFIG, marca: 'Editada' };
    prisma.siteConfig.findUnique.mockResolvedValue(row);
    await expect(service.get()).resolves.toEqual(row);
  });

  it('update() hace upsert sobre la fila única id=1', async () => {
    prisma.siteConfig.upsert.mockResolvedValue({ id: 1 });
    await service.update({ marca: 'Nueva' });
    expect(prisma.siteConfig.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        update: expect.objectContaining({ marca: 'Nueva' }),
      }),
    );
  });
});
