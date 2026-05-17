import { IsString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested, Min, Max, MaxLength, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export enum EstadoLote {
  disponible = 'disponible',
  reservado = 'reservado',
  vendido = 'vendido',
}

export class ServicioDto {
  @IsString() @MaxLength(100) nombre: string;
  @IsString() @MaxLength(50)  icono: string;
}

export class CreateLoteDto {
  @IsString() @MaxLength(20)   numero: string;
  @IsString() @MaxLength(50)   manzana: string;
  @IsNumber() @Min(1)          area: number;
  @IsNumber() @Min(0)          precio: number;
  @IsString() @MaxLength(300)  ubicacion: string;
  @IsEnum(EstadoLote) @IsOptional() estado?: EstadoLote;
  @IsString() @MaxLength(2000) @IsOptional() descripcion?: string;
  @IsUrl({ require_tld: false }) @IsOptional() imagen?: string;
  @IsNumber() @Min(-90)  @Max(90)  @IsOptional() latitud?: number;
  @IsNumber() @Min(-180) @Max(180) @IsOptional() longitud?: number;
  @IsArray() @ValidateNested({ each: true }) @Type(() => ServicioDto) @IsOptional() servicios?: ServicioDto[];
}

export class UpdateLoteDto {
  @IsString() @MaxLength(20)   @IsOptional() numero?: string;
  @IsString() @MaxLength(50)   @IsOptional() manzana?: string;
  @IsNumber() @Min(1)          @IsOptional() area?: number;
  @IsNumber() @Min(0)          @IsOptional() precio?: number;
  @IsString() @MaxLength(300)  @IsOptional() ubicacion?: string;
  @IsEnum(EstadoLote) @IsOptional() estado?: EstadoLote;
  @IsString() @MaxLength(2000) @IsOptional() descripcion?: string;
  @IsUrl({ require_tld: false }) @IsOptional() imagen?: string;
  @IsNumber() @Min(-90)  @Max(90)  @IsOptional() latitud?: number;
  @IsNumber() @Min(-180) @Max(180) @IsOptional() longitud?: number;
  @IsArray() @ValidateNested({ each: true }) @Type(() => ServicioDto) @IsOptional() servicios?: ServicioDto[];
}
