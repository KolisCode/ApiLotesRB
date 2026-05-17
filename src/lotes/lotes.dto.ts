import { IsString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum EstadoLote {
  disponible = 'disponible',
  reservado = 'reservado',
  vendido = 'vendido',
}

export class ServicioDto {
  @IsString() nombre: string;
  @IsString() icono: string;
}

export class CreateLoteDto {
  @IsString() numero: string;
  @IsString() manzana: string;
  @IsNumber() @Min(1) area: number;
  @IsNumber() @Min(0) precio: number;
  @IsString() ubicacion: string;
  @IsEnum(EstadoLote) @IsOptional() estado?: EstadoLote;
  @IsString() @IsOptional() descripcion?: string;
  @IsString() @IsOptional() imagen?: string;
  @IsNumber() @IsOptional() latitud?: number;
  @IsNumber() @IsOptional() longitud?: number;
  @IsArray() @ValidateNested({ each: true }) @Type(() => ServicioDto) @IsOptional() servicios?: ServicioDto[];
}

export class UpdateLoteDto {
  @IsString() @IsOptional() numero?: string;
  @IsString() @IsOptional() manzana?: string;
  @IsNumber() @Min(1) @IsOptional() area?: number;
  @IsNumber() @Min(0) @IsOptional() precio?: number;
  @IsString() @IsOptional() ubicacion?: string;
  @IsEnum(EstadoLote) @IsOptional() estado?: EstadoLote;
  @IsString() @IsOptional() descripcion?: string;
  @IsString() @IsOptional() imagen?: string;
  @IsNumber() @IsOptional() latitud?: number;
  @IsNumber() @IsOptional() longitud?: number;
  @IsArray() @ValidateNested({ each: true }) @Type(() => ServicioDto) @IsOptional() servicios?: ServicioDto[];
}
