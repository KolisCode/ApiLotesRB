import { Injectable, UnauthorizedException, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
  ) {}

  async onModuleInit() {
    this.dummyHash = await bcrypt.hash(Math.random().toString(), BCRYPT_ROUNDS);
  }

  async login(dto: LoginDto) {
    const admin = await this.prisma.admin.findUnique({ where: { email: dto.email } });

    const valid = await bcrypt.compare(dto.password, admin?.password ?? this.dummyHash);

    if (!admin || !valid) {
      this.logger.warn(`Login fallido para email: ${dto.email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.jwt.sign({ sub: admin.id, email: admin.email });
    this.logger.log(`Login exitoso: ${admin.email}`);
    return { access_token: token, admin: { id: admin.id, email: admin.email, nombre: admin.nombre } };
  }

  async crearAdmin(email: string, password: string, nombre: string) {
    const exists = await this.prisma.admin.findUnique({ where: { email } });
    if (exists) return { message: 'Admin ya existe' };

    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const admin = await this.prisma.admin.create({ data: { email, password: hash, nombre } });
    return { message: 'Admin creado', id: admin.id };
  }
}
