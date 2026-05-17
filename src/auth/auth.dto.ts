import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail() @MaxLength(254) email: string;
  @IsString() @MinLength(6) @MaxLength(100) password: string;
}
