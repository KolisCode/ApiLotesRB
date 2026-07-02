<p align="center">
  <img src="https://raw.githubusercontent.com/KolisCode/lotesRB/master/screenshots/readme-banner.png" alt="KolisCode Banner" width="100%"/>
</p>

# LotesRB — API

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

> API del portal inmobiliario LotesRB. **Frontend:** [lotesRB](https://github.com/KolisCode/lotesRB) · **Demo:** [lotesrb.koliscode.com](https://lotesrb.koliscode.com)

Backend del proyecto Robinson. REST API construida con NestJS + Prisma + PostgreSQL. Gestiona lotes, autenticación de administradores, mensajes de contacto y subida de imágenes.

## Stack

- **NestJS 11** — módulos, guards, pipes, interceptors
- **Prisma 5** — ORM para PostgreSQL
- **PostgreSQL** — base de datos
- **JWT + Passport** — autenticación del panel admin
- **Multer** — upload de imágenes

## Requisitos previos

- Node.js 20+
- PostgreSQL corriendo (local: Docker recomendado)

## Instalación

```bash
npm install
```

## Variables de entorno

Crear `.env` en la raíz (ya existe con valores de dev):

```env
DATABASE_URL="postgresql://dev:dev1234@localhost:5432/lotesrb?schema=public"
JWT_SECRET="cambiar-por-secreto-aleatorio-minimo-32-chars"
JWT_EXPIRES_IN="2h"
PORT=3001
CORS_ORIGINS="http://localhost:4200,https://tu-dominio.com"
SEED_ADMIN_EMAIL="admin@lotesrb.com"
SEED_ADMIN_NOMBRE="Administrador"
SEED_ADMIN_PASSWORD="contraseña-segura"
```

> El `.env` está en `.gitignore`. Nunca committear credenciales reales.

## Base de datos

```bash
# Aplicar migraciones y generar cliente Prisma
npx prisma migrate dev

# Cargar datos iniciales (admin + lotes de ejemplo)
npm run seed
```

## Desarrollo local

```bash
npm run start:dev    # http://localhost:3001/api  (watch mode)
```

## Build de producción

```bash
npm run build        # compila a dist/
npm run start:prod   # ejecuta desde dist/
```

---

## Estructura

```
src/
├── main.ts                      # Bootstrap: helmet, CORS, ValidationPipe, static assets
├── app.module.ts                # Módulo raíz: importa todos los módulos
│
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts        # PrismaClient singleton (OnModuleInit/OnModuleDestroy)
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts       # POST /api/auth/login
│   ├── auth.service.ts          # bcrypt, JWT sign, crearAdmin (usado solo por seed)
│   ├── auth.dto.ts              # LoginDto
│   ├── jwt.strategy.ts          # Extrae {id, email} del token
│   └── jwt-auth.guard.ts        # Guard que protege rutas privadas
│
├── lotes/
│   ├── lotes.module.ts
│   ├── lotes.controller.ts      # GET /api/lotes, GET /api/lotes/stats, GET /api/lotes/:id
│   │                            # POST /api/lotes, PUT /api/lotes/:id, DELETE /api/lotes/:id
│   ├── lotes.service.ts         # CRUD con Prisma, stats por groupBy
│   └── lotes.dto.ts             # CreateLoteDto, UpdateLoteDto, ServicioDto
│
├── contacto/
│   ├── contacto.module.ts
│   ├── contacto.controller.ts   # POST /api/contacto, GET /api/contacto
│   │                            # PATCH /api/contacto/:id/leido, DELETE /api/contacto/:id
│   ├── contacto.service.ts      # create, findAll, marcarLeido, remove
│   └── contacto.dto.ts          # CreateContactoDto
│
└── upload/
    ├── upload.module.ts
    └── upload.controller.ts     # POST /api/upload/imagen (JWT requerido)
                                 # Guarda en ./uploads/, devuelve URL absoluta

prisma/
├── schema.prisma                # Modelos: Lote, Servicio, Contacto, Admin
└── seed.ts                      # Admin inicial + 8 lotes de ejemplo

uploads/                         # Archivos subidos (no committear)
```

---

## Endpoints

### Públicos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/lotes` | Lista todos los lotes. Query `?estado=disponible\|reservado\|vendido` |
| `GET` | `/api/lotes/:id` | Detalle de un lote |
| `POST` | `/api/contacto` | Crear mensaje de contacto (throttle: 5/min) |

### Requieren JWT (`Authorization: Bearer <token>`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Login (throttle: 5/min). Devuelve `access_token` |
| `GET` | `/api/lotes/stats` | Conteo de lotes por estado |
| `POST` | `/api/lotes` | Crear lote |
| `PUT` | `/api/lotes/:id` | Actualizar lote |
| `DELETE` | `/api/lotes/:id` | Eliminar lote |
| `GET` | `/api/contacto` | Listar mensajes. Query `?noLeidos=true` |
| `PATCH` | `/api/contacto/:id/leido` | Marcar mensaje como leído |
| `DELETE` | `/api/contacto/:id` | Eliminar mensaje |
| `POST` | `/api/upload/imagen` | Subir imagen (multipart/form-data, campo `file`). Devuelve `{ url }` |

### Archivos estáticos

| Ruta | Descripción |
|------|-------------|
| `GET` | `/uploads/:filename` | Imagen subida. Servida directamente por Express |

---

## Modelo de datos

```
Lote
  id, numero*, manzana, area, precio, ubicacion
  estado (disponible | reservado | vendido)
  descripcion?, imagen?, latitud?, longitud?
  servicios → Servicio[]
  createdAt, updatedAt

Servicio
  id, nombre, icono
  loteId → Lote (cascade delete)

Contacto
  id, nombre, email?, telefono?, mensaje
  loteId?, leido (default false)
  createdAt

Admin
  id, email*, password (bcrypt), nombre
  createdAt
```

`*` campo único

---

## Seguridad

- **Helmet** — headers de seguridad en todas las respuestas
- **CORS** — orígenes controlados por variable `CORS_ORIGINS`
- **Rate limiting** — global 60 req/min; login y contacto 5 req/min
- **bcrypt** (12 rounds) — hash de contraseñas
- **Timing-safe login** — siempre compara contra un hash (real o dummy) para evitar enumeración de emails por tiempo de respuesta
- **ValidationPipe** — `whitelist: true`, rechaza campos no declarados en DTOs
- **JWT** — expira en 2h (configurable con `JWT_EXPIRES_IN`)
- **trust proxy: 1** — necesario detrás de Nginx para obtener protocolo y IP reales

---

## Deploy a producción

El frontend se sirve en `https://lotesrb.koliscode.com`.

### Pasos generales

1. **Build frontend** en local y subir `dist/lotes-rb/` al servidor
2. **Build API** y subir o clonar el repo en el servidor
3. **Configurar `.env`** de producción con credenciales reales
4. **PostgreSQL** en el droplet: crear BD y usuario, correr `npx prisma migrate deploy`
5. **PM2** para gestionar el proceso Node: `pm2 start dist/main.js --name lotes-api`
6. **Nginx** como proxy inverso:

```nginx
server {
    listen 443 ssl;
    server_name lotesrb.koliscode.com;

    # Certificado SSL (Let's Encrypt)

    # Frontend (archivos estáticos Angular)
    root /var/www/lotes-rb;
    index index.html;
    try_files $uri $uri/ /index.html;

    # Proxy a la API NestJS
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Imágenes subidas
    location /uploads/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
    }
}
```

> El header `X-Forwarded-Proto` es necesario para que las URLs de imágenes generadas por la API sean `https://` en producción.
