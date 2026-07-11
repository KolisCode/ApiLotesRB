import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SiteConfigService } from './site-config.service';
import { UpdateSiteConfigDto } from './site-config.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('SiteConfig')
@Controller('site-config')
export class SiteConfigController {
  constructor(private readonly service: SiteConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Configuración pública del sitio', description: 'Textos, contacto y hero editables desde el panel' })
  @ApiResponse({ status: 200, description: 'Configuración vigente (o valores por defecto)' })
  get() {
    return this.service.get();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar configuración del sitio (admin)' })
  @ApiResponse({ status: 200, description: 'Configuración actualizada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(@Body() dto: UpdateSiteConfigDto) {
    return this.service.update(dto);
  }
}
