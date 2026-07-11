import { Injectable, UnauthorizedException, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private dummyHash = '';

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async onModuleInit() {
    this.dummyHash = await bcrypt.hash(Math.random().toString(), BCRYPT_ROUNDS);
  }

  /** Firma el par access + refresh (el refresh usa su propio secreto y expira más tarde). */
  private firmarTokens(admin: { id: number; email: string }) {
    const payload = { sub: admin.id, email: admin.email };
    const access_token = this.jwt.sign(payload);
    const refresh_token = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET')!,
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') as any,
    });
    return { access_token, refresh_token };
  }

  async login(dto: LoginDto) {
    const admin = await this.prisma.admin.findUnique({ where: { email: dto.email } });

    const valid = await bcrypt.compare(dto.password, admin?.password ?? this.dummyHash);

    if (!admin || !valid) {
      this.logger.warn(`Login fallido para email: ${dto.email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    this.logger.log(`Login exitoso: ${admin.email}`);
    return {
      ...this.firmarTokens(admin),
      admin: { id: admin.id, email: admin.email, nombre: admin.nombre },
    };
  }

  /** Canjea un refresh token válido por un par nuevo (rotación). */
  async refresh(refreshToken: string) {
    let payload: { sub: number; email: string };
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET')!,
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    // El admin debe seguir existiendo (revoca sesiones si se borró la cuenta).
    const admin = await this.prisma.admin.findUnique({ where: { id: payload.sub } });
    if (!admin) throw new UnauthorizedException('Cuenta no encontrada');

    return this.firmarTokens(admin);
  }

  async crearAdmin(email: string, password: string, nombre: string) {
    const exists = await this.prisma.admin.findUnique({ where: { email } });
    if (exists) return { message: 'Admin ya existe' };

    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const admin = await this.prisma.admin.create({ data: { email, password: hash, nombre } });
    return { message: 'Admin creado', id: admin.id };
  }
}
