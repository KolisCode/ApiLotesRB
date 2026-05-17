import { IsEmail, IsString, IsOptional, IsNumber, IsPositive, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateContactoDto {
  @IsString() @MinLength(2) @MaxLength(100) nombre: string;
  @IsEmail() @MaxLength(254) @IsOptional() email?: string;
  @IsString() @MaxLength(20) @Matches(/^[\d\s+\-().]{7,20}$/) @IsOptional() telefono?: string;
  @IsString() @MinLength(1) @MaxLength(3000) mensaje: string;
  @IsNumber() @IsPositive() @IsOptional() loteId?: number;
}
