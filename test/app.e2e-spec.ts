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

  describe('flujo autenticado (requiere admin sembrado)', () => {
    let token: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: process.env.SEED_ADMIN_EMAIL ?? 'admin@lotesrb.com',
          password: process.env.SEED_ADMIN_PASSWORD,
        });
      token = res.body?.access_token;
    });

    it('login devuelve un access_token', () => {
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(20);
    });

    it('POST /api/contacto (201) y luego DELETE con token (200)', async () => {
      const creado = await request(app.getHttpServer())
        .post('/api/contacto')
        .send({ nombre: 'E2E', mensaje: 'test' })
        .expect(201);

      const id = creado.body.id;
      expect(typeof id).toBe('number');

      await request(app.getHttpServer())
        .delete(`/api/contacto/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('PUT /api/site-config con token actualiza y persiste', async () => {
      const original = (await request(app.getHttpServer()).get('/api/site-config')).body.marca;

      await request(app.getHttpServer())
        .put('/api/site-config')
        .set('Authorization', `Bearer ${token}`)
        .send({ marca: 'E2E-Marca' })
        .expect(200)
        .expect(res => { if (res.body.marca !== 'E2E-Marca') throw new Error('no actualizó marca'); });

      // restaura
      await request(app.getHttpServer())
        .put('/api/site-config')
        .set('Authorization', `Bearer ${token}`)
        .send({ marca: original })
        .expect(200);
    });
  });
});
