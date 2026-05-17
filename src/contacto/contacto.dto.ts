import { IsEmail, IsString, IsOptional, IsNumber, IsPositive, MinLength } from 'class-validator';

export class CreateContactoDto {
  @IsString() @MinLength(2) nombre: string;
  @IsEmail() @IsOptional() email?: string;
  @IsString() @IsOptional() telefono?: string;
  @IsString() @MinLength(1) mensaje: string;
  @IsNumber() @IsPositive() @IsOptional() loteId?: number;
}
