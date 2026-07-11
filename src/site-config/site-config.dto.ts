import { IsString, IsOptional, IsArray, ValidateNested, MaxLength, Matches, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VentajaDto {
  @ApiProperty({ example: '📄' })
  @IsString() @MaxLength(8) icono: string;

  @ApiProperty({ example: 'Escrituración garantizada' })
  @IsString() @MaxLength(80) titulo: string;

  @ApiProperty({ example: 'Todos los lotes cuentan con escritura pública.' })
  @IsString() @MaxLength(300) desc: string;
}

export class DistanciaDto {
  @ApiProperty({ example: '🏫' })
  @IsString() @MaxLength(8) icono: string;

  @ApiProperty({ example: 'Colegio más cercano' })
  @IsString() @MaxLength(80) lugar: string;

  @ApiProperty({ example: '5 min · 2 km' })
  @IsString() @MaxLength(60) detalle: string;
}

export class InfraestructuraDto {
  @ApiProperty({ example: '💧' })
  @IsString() @MaxLength(8) icono: string;

  @ApiProperty({ example: 'Agua potable' })
  @IsString() @MaxLength(60) nombre: string;
}

export class PasoDto {
  @ApiProperty({ example: '🔍' })
  @IsString() @MaxLength(8) icono: string;

  @ApiProperty({ example: 'Elige tu lote' })
  @IsString() @MaxLength(80) titulo: string;

  @ApiProperty({ example: 'Revisa el catálogo y agenda una visita.' })
  @IsString() @MaxLength(400) desc: string;
}

/** Todos los campos son opcionales: el PUT actualiza solo lo que llega. */
export class UpdateSiteConfigDto {
  @ApiPropertyOptional({ example: '573001234567', description: 'Solo dígitos, sin + ni espacios' })
  @IsString() @Matches(/^\d{7,15}$/, { message: 'whatsappNumber debe ser 7-15 dígitos sin símbolos' }) @IsOptional()
  whatsappNumber?: string;

  @ApiPropertyOptional({ example: '+57 300 123 4567' })
  @IsString() @MaxLength(40) @IsOptional() telefono?: string;

  @ApiPropertyOptional({ example: 'ventas@lotesrb.com' })
  @IsString() @MaxLength(120) @IsOptional() email?: string;

  @ApiPropertyOptional({ example: 'Km 5 vía El Bosque, Villavicencio' })
  @IsString() @MaxLength(200) @IsOptional() direccion?: string;

  @ApiPropertyOptional({ example: 'Lunes a sábado · 8:00 a.m. – 6:00 p.m.' })
  @IsString() @MaxLength(120) @IsOptional() horario?: string;

  @ApiPropertyOptional({ example: 'LotesRB' })
  @IsString() @MaxLength(60) @IsOptional() marca?: string;

  @ApiPropertyOptional({ example: 'Tu terreno, tu futuro.' })
  @IsString() @MaxLength(120) @IsOptional() tagline?: string;

  @ApiPropertyOptional({ example: 'Proyecto residencial · Lotes desde 160 m²' })
  @IsString() @MaxLength(160) @IsOptional() heroEyebrow?: string;

  @ApiPropertyOptional({ example: 'Tu terreno propio, al alcance de tu mano' })
  @IsString() @MaxLength(160) @IsOptional() heroTitulo?: string;

  @ApiPropertyOptional({ example: 'Lotes con todos los servicios y financiación directa.' })
  @IsString() @MaxLength(300) @IsOptional() heroSubtitulo?: string;

  @ApiPropertyOptional({ example: 'https://lotesrb.koliscode.com/uploads/hero-123.jpg' })
  @IsUrl({ require_tld: false }) @IsOptional() heroImagen?: string;

  @ApiPropertyOptional({ type: [VentajaDto], description: 'Reemplaza la lista completa de ventajas' })
  @IsArray() @ValidateNested({ each: true }) @Type(() => VentajaDto) @IsOptional() ventajas?: VentajaDto[];

  // ── Página Proyecto ──
  @ApiPropertyOptional({ example: 'Villavicencio, Meta' })
  @IsString() @MaxLength(120) @IsOptional() proyectoMunicipio?: string;

  @ApiPropertyOptional({ example: 'Lotes El Bosque' })
  @IsString() @MaxLength(120) @IsOptional() proyectoNombre?: string;

  @ApiPropertyOptional({ example: 'Un desarrollo pensado para cada familia…' })
  @IsString() @MaxLength(500) @IsOptional() proyectoDescripcion?: string;

  @ApiPropertyOptional({ type: [DistanciaDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => DistanciaDto) @IsOptional() distancias?: DistanciaDto[];

  @ApiPropertyOptional({ type: [InfraestructuraDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => InfraestructuraDto) @IsOptional() infraestructura?: InfraestructuraDto[];

  @ApiPropertyOptional({ type: [PasoDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => PasoDto) @IsOptional() pasos?: PasoDto[];

  @ApiPropertyOptional({ example: 'Financiación directa con el vendedor' })
  @IsString() @MaxLength(120) @IsOptional() financiacionTitulo?: string;

  @ApiPropertyOptional({ example: 'No necesitas banco…' })
  @IsString() @MaxLength(500) @IsOptional() financiacionTexto?: string;
}
