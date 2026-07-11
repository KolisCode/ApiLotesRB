import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSiteConfigDto } from './site-config.dto';
import { DEFAULT_SITE_CONFIG } from './site-config.defaults';

const SINGLETON_ID = 1;

@Injectable()
export class SiteConfigService {
  constructor(private prisma: PrismaService) {}

  /** Lectura pública. Si aún no existe la fila, devuelve los defaults (nunca rompe el sitio). */
  async get() {
    const cfg = await this.prisma.siteConfig.findUnique({ where: { id: SINGLETON_ID } });
    return cfg ?? DEFAULT_SITE_CONFIG;
  }

  /** Actualiza (o crea) la fila única con los campos recibidos. */
  update(dto: UpdateSiteConfigDto) {
    return this.prisma.siteConfig.upsert({
      where: { id: SINGLETON_ID },
      update: { ...dto } as Prisma.SiteConfigUpdateInput,
      create: { ...DEFAULT_SITE_CONFIG, ...dto, id: SINGLETON_ID } as Prisma.SiteConfigCreateInput,
    });
  }
}
