import { IsString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested, Min, Max, MaxLength, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EstadoLote {
  disponible = 'disponible',
  reservado = 'reservado',
  vendido = 'vendido',
}

export class ServicioDto {
  @ApiProperty({ example: 'Agua potable' })
  @IsString() @MaxLength(100) nombre: string;

  @ApiProperty({ example: 'water' })
  @IsString() @MaxLength(50) icono: string;
}

export class CreateLoteDto {
  @ApiProperty({ example: 'A-01' })
  @IsString() @MaxLength(20) numero: string;

  @ApiProperty({ example: 'Manzana 1' })
  @IsString() @MaxLength(50) manzana: string;

  @ApiProperty({ example: 120.5, description: 'Área en m²' })
  @IsNumber() @Min(1) area: number;

  @ApiProperty({ example: 25000000, description: 'Precio en COP' })
  @IsNumber() @Min(0) precio: number;

  @ApiProperty({ example: 'Urbanización El Bosque, Km 5 vía principal' })
  @IsString() @MaxLength(300) ubicacion: string;

  @ApiPropertyOptional({ enum: EstadoLote, default: EstadoLote.disponible })
  @IsEnum(EstadoLote) @IsOptional() estado?: EstadoLote;

  @ApiPropertyOptional({ example: 'Lote esquinero con vista panorámica' })
  @IsString() @MaxLength(2000) @IsOptional() descripcion?: string;

  @ApiPropertyOptional({ example: 'https://example.com/lote.jpg' })
  @IsUrl({ require_tld: false }) @IsOptional() imagen?: string;

  @ApiPropertyOptional({ example: 4.5709, description: 'Latitud (-90 a 90)' })
  @IsNumber() @Min(-90) @Max(90) @IsOptional() latitud?: number;

  @ApiPropertyOptional({ example: -75.6645, description: 'Longitud (-180 a 180)' })
  @IsNumber() @Min(-180) @Max(180) @IsOptional() longitud?: number;

  @ApiPropertyOptional({ type: [ServicioDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => ServicioDto) @IsOptional() servicios?: ServicioDto[];
}

export class UpdateLoteDto {
  @ApiPropertyOptional({ example: 'A-01' })
  @IsString() @MaxLength(20) @IsOptional() numero?: string;

  @ApiPropertyOptional({ example: 'Manzana 1' })
  @IsString() @MaxLength(50) @IsOptional() manzana?: string;

  @ApiPropertyOptional({ example: 120.5 })
  @IsNumber() @Min(1) @IsOptional() area?: number;

  @ApiPropertyOptional({ example: 25000000 })
  @IsNumber() @Min(0) @IsOptional() precio?: number;

  @ApiPropertyOptional()
  @IsString() @MaxLength(300) @IsOptional() ubicacion?: string;

  @ApiPropertyOptional({ enum: EstadoLote })
  @IsEnum(EstadoLote) @IsOptional() estado?: EstadoLote;

  @ApiPropertyOptional()
  @IsString() @MaxLength(2000) @IsOptional() descripcion?: string;

  @ApiPropertyOptional()
  @IsUrl({ require_tld: false }) @IsOptional() imagen?: string;

  @ApiPropertyOptional()
  @IsNumber() @Min(-90) @Max(90) @IsOptional() latitud?: number;

  @ApiPropertyOptional()
  @IsNumber() @Min(-180) @Max(180) @IsOptional() longitud?: number;

  @ApiPropertyOptional({ type: [ServicioDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => ServicioDto) @IsOptional() servicios?: ServicioDto[];
}
