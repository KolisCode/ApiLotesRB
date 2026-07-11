import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

// Smoke e2e del sitio público. Requiere DATABASE_URL activa (misma DB que dev).
describe('LotesRB API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/site-config → 200 con la config pública', () => {
    return request(app.getHttpServer())
      .get('/api/site-config')
      .expect(200)
      .expect(res => {
        if (typeof res.body.whatsappNumber !== 'string') {
          throw new Error('site-config sin whatsappNumber');
        }
      });
  });

  it('GET /api/lotes → 200 y devuelve un arreglo', () => {
    return request(app.getHttpServer())
      .get('/api/lotes')
      .expect(200)
      .expect(res => {
        if (!Array.isArray(res.body)) throw new Error('lotes no es arreglo');
      });
  });

  it('PUT /api/site-config sin token → 401', () => {
    return request(app.getHttpServer())
      .put('/api/site-config')
      .send({ marca: 'HACK' })
      .expect(401);
  });
});
