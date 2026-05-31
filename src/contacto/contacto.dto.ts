import { IsEmail, IsString, IsOptional, IsNumber, IsPositive, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactoDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString() @MinLength(2) @MaxLength(100) nombre: string;

  @ApiPropertyOptional({ example: 'juan@email.com' })
  @IsEmail() @MaxLength(254) @IsOptional() email?: string;

  @ApiPropertyOptional({ example: '+57 300 123 4567' })
  @IsString() @MaxLength(20) @Matches(/^[\d\s+\-().]{7,20}$/) @IsOptional() telefono?: string;

  @ApiProperty({ example: 'Estoy interesado en el lote A-01, ¿está disponible?' })
  @IsString() @MinLength(1) @MaxLength(3000) mensaje: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del lote de interés' })
  @IsNumber() @IsPositive() @IsOptional() loteId?: number;
}
