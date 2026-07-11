# LotesRB API — Backend NestJS

API REST para el sistema de lotes inmobiliarios Robinson. NestJS 11 + Prisma + PostgreSQL + JWT.

**Instrucción:** Mantén este archivo actualizado de forma proactiva. Si en una conversación surge información útil — decisiones de arquitectura, endpoints nuevos, variables de entorno — actualiza la sección correspondiente.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 |
| ORM | Prisma 5 + `@prisma/client` |
| Base de datos | PostgreSQL (variable `DATABASE_URL`) |
| Auth | JWT (`@nestjs/jwt` + `passport-jwt`), 2 horas, sin refresh token |
| Validación | `class-validator` + `class-transformer` + `ValidationPipe` global |
| Rate limiting | `@nestjs/throttler` — 60/min global, 5/min en login y contacto, 10/min en upload |
| Seguridad | Helmet, CORS desde `CORS_ORIGINS`, throttling global |
| Config | `@nestjs/config` + Joi (variables validadas al arranque) |
| Puerto | `PORT` env (default 3001) |

## Variables de entorno requeridas

```env
DATABASE_URL=           # PostgreSQL connection string
JWT_SECRET=             # mínimo 32 caracteres
JWT_EXPIRES_IN=2h       # default
PORT=3001               # default
CORS_ORIGINS=           # origen(es) permitidos
```

## Módulos

```
src/
├── auth/               ← login + JWT strategy + guard
│   ├── auth.controller.ts   — @Throttle 5/min
│   ├── auth.service.ts
│   └── jwt.strategy.ts
├── lotes/              ← catálogo público + CRUD admin
│   ├── lotes.controller.ts
│   ├── lotes.service.ts
│   └── lotes.dto.ts    — valida lat/lng (-90/90 y -180/180)
├── contacto/           ← formulario de contacto público
│   └── contacto.controller.ts  — @Throttle 5/min
├── upload/             ← subida de imágenes (lotes, hero, branding) — @Throttle 10/min
│   └── upload.controller.ts    — ⚠️ ya montado en app.module (antes estaba huérfano)
├── site-config/        ← configuración editable del sitio público (singleton id=1)
│   ├── site-config.controller.ts  — GET público · PUT (JWT)
│   ├── site-config.service.ts
│   ├── site-config.dto.ts         — whatsapp = 7-15 dígitos
│   └── site-config.defaults.ts    — defaults compartidos con prisma/seed.ts
├── prisma/             ← PrismaService singleton
└── app.module.ts       ← ThrottlerModule + ConfigModule global
```

## Schema Prisma (entidades principales)

```prisma
model Lote {
  id          Int        @id @default(autoincrement())
  numero      String
  manzana     String
  area        Float
  precio      Float
  ubicacion   String
  estado      EstadoLote @default(DISPONIBLE)
  descripcion String?
  imagen      String?
  latitud     Float?
  longitud    Float?
  servicios   Servicio[]
}

enum EstadoLote { disponible reservado vendido }   // ⚠️ minúsculas en el código real
```

Además existe `model SiteConfig` (fila única id=1) con la config editable del sitio:
contacto (whatsapp/telefono/email/direccion/horario), branding (marca/tagline), hero*,
`ventajas` (Json) y **la página Proyecto** (proyectoMunicipio/Nombre/Descripcion,
`distancias`/`infraestructura`/`pasos` Json, financiacion*).

`Contacto.loteId` es **FK real** a `Lote` con `onDelete: SetNull` (migración `contacto_lote_fk`).
El módulo contacto expone `DELETE /contacto/:id` (admin).

## Autenticación

- Solo existe un modelo `Admin` (no usuarios públicos)
- Guard `JwtAuthGuard` protege todos los endpoints `/admin/*`
- Token en header `Authorization: Bearer {token}`
- Sin refresh tokens — al vencer, el cliente debe hacer login de nuevo

## Lo que falta

- Tests reales — solo boilerplate en `test/` (incluido el módulo site-config, verificado a mano).
- Serving de `/uploads` en prod: `main.ts` ya lo sirve con `useStaticAssets`, pero en el droplet
  Nginx debe enrutar `/uploads` → backend (o servir el dir) y `uploads/` debe persistir al deploy.

> Ya resueltos (antes figuraban aquí): Swagger (`/api/docs`) y el global exception filter existen.

## Comandos

```bash
npm run start:dev       # dev con hot reload
npm run build           # compila a dist/
npx prisma studio       # UI visual de la base de datos
npx prisma db push      # aplica cambios del schema
npm run seed            # seed inicial de datos
```

## Deploy en producción

El servidor corre en el droplet en `104.236.122.146`, en `/opt/lotesrb-api` (PM2 `lotesrb-api`, :3001).
La API no se sirve directamente — Nginx hace proxy desde `lotesrb.koliscode.com/api` → `localhost:3001`.

**Flujo real de deploy (comprobado 2026-07-02):** el repo del droplet **no tiene remote git**
ni devDependencies (`nest: not found`), así que el flujo git-pull de `deploy_project` del
MCP **no funciona**. Deploy correcto:

```bash
npm run build                                        # build local
# rsync de dist/ → droplet:/opt/lotesrb-api/dist/   (deploy_static del MCP droplet)
ssh droplet "pm2 restart lotesrb-api"
```

Pendiente decidir si se configura un deploy key para `KolisCode/ApiLotesRB` y se
normaliza al flujo git-pull.
