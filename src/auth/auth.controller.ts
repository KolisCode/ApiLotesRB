import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Login de administrador' })
  @ApiResponse({ status: 201, description: 'Par de tokens', schema: { example: { access_token: 'eyJ...', refresh_token: 'eyJ...' } } })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiResponse({ status: 429, description: 'Demasiados intentos — espera 60s' })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Post('refresh')
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @ApiOperation({ summary: 'Renovar el access token con un refresh token' })
  @ApiResponse({ status: 201, description: 'Par de tokens nuevo' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  refresh(@Body() dto: RefreshDto) {
    return this.service.refresh(dto.refreshToken);
  }
}
