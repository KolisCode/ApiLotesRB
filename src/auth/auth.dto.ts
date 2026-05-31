import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@lotesrb.com' })
  @IsEmail() @MaxLength(254) email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString() @MinLength(6) @MaxLength(100) password: string;
}
