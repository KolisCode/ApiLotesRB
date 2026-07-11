import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { LotesModule } from './lotes/lotes.module';
import { AuthModule } from './auth/auth.module';
import { ContactoModule } from './contacto/contacto.module';
import { UploadModule } from './upload/upload.module';
import { SiteConfigModule } from './site-config/site-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL:   Joi.string().required(),
        JWT_SECRET:     Joi.string().min(32).required(),
        JWT_EXPIRES_IN: Joi.string().default('2h'),
        PORT:           Joi.number().default(3001),
        CORS_ORIGINS:   Joi.string().required(),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    LotesModule,
    AuthModule,
    ContactoModule,
    UploadModule,
    SiteConfigModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
