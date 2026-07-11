import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet({ contentSecurityPolicy: false }));
  app.useGlobalFilters(new HttpExceptionFilter());

  // Sirve las imágenes subidas (hero, branding, lotes) en /uploads.
  // En producción Nginx debe enrutar /uploads → este backend (o servir el dir directamente).
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const originsEnv = process.env.CORS_ORIGINS ?? 'http://localhost:4200';
  const allowedOrigins = originsEnv.split(',').map(o => o.trim());
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('LotesRB API')
    .setDescription('API REST para el portal inmobiliario LotesRB')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API corriendo en http://localhost:${port}/api`);
  console.log(`Swagger docs en http://localhost:${port}/api/docs`);
}
bootstrap();
