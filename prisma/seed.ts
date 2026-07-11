import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DEFAULT_SITE_CONFIG } from '../src/site-config/site-config.defaults';

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

async function main() {
  const email  = process.env.SEED_ADMIN_EMAIL  ?? 'admin@lotesrb.com';
  const pass   = process.env.SEED_ADMIN_PASSWORD;
  const nombre = process.env.SEED_ADMIN_NOMBRE ?? 'Administrador';

  if (!pass) {
    console.error('Error: SEED_ADMIN_PASSWORD debe estar definido en .env');
    process.exit(1);
  }

  const hash = await bcrypt.hash(pass, BCRYPT_ROUNDS);
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, password: hash, nombre },
  });

  const lotes = [
    {
      numero: 'A-01', manzana: 'A', area: 200, precio: 45000000,
      ubicacion: 'Sector Norte, frente a vía principal', estado: 'disponible' as const,
      descripcion: 'Lote esquinero con excelente iluminación natural y acceso a vía principal.',
      latitud: 4.1490, longitud: -73.6400,
      servicios: [{ nombre: 'Agua potable', icono: 'water' }, { nombre: 'Energía eléctrica', icono: 'bolt' }, { nombre: 'Alcantarillado', icono: 'drain' }, { nombre: 'Vía pavimentada', icono: 'road' }],
    },
    {
      numero: 'A-02', manzana: 'A', area: 180, precio: 38000000,
      ubicacion: 'Sector Norte, interior', estado: 'disponible' as const,
      descripcion: 'Lote interior con acceso desde vía secundaria, terreno plano.',
      servicios: [{ nombre: 'Agua potable', icono: 'water' }, { nombre: 'Energía eléctrica', icono: 'bolt' }, { nombre: 'Alcantarillado', icono: 'drain' }],
    },
    {
      numero: 'A-03', manzana: 'A', area: 220, precio: 52000000,
      ubicacion: 'Sector Norte, esquinero', estado: 'reservado' as const,
      descripcion: 'Lote esquinero de gran área, ideal para construcción amplia.',
      servicios: [{ nombre: 'Agua potable', icono: 'water' }, { nombre: 'Energía eléctrica', icono: 'bolt' }, { nombre: 'Gas natural', icono: 'gas' }, { nombre: 'Alcantarillado', icono: 'drain' }, { nombre: 'Vía pavimentada', icono: 'road' }],
    },
    {
      numero: 'B-01', manzana: 'B', area: 160, precio: 32000000,
      ubicacion: 'Sector Sur, zona residencial', estado: 'disponible' as const,
      descripcion: 'Lote en zona residencial tranquila, cerca a parque comunal.',
      servicios: [{ nombre: 'Agua potable', icono: 'water' }, { nombre: 'Energía eléctrica', icono: 'bolt' }, { nombre: 'Alcantarillado', icono: 'drain' }],
    },
    {
      numero: 'B-02', manzana: 'B', area: 175, precio: 36500000,
      ubicacion: 'Sector Sur, zona residencial', estado: 'vendido' as const,
      descripcion: 'Lote residencial con vista a zona verde.',
      servicios: [{ nombre: 'Agua potable', icono: 'water' }, { nombre: 'Energía eléctrica', icono: 'bolt' }, { nombre: 'Alcantarillado', icono: 'drain' }, { nombre: 'Gas natural', icono: 'gas' }],
    },
    {
      numero: 'B-03', manzana: 'B', area: 240, precio: 60000000,
      ubicacion: 'Sector Sur, frente a parque', estado: 'disponible' as const,
      descripcion: 'Lote premium frente al parque comunal, el más amplio del sector.',
      latitud: 4.1380, longitud: -73.6200,
      servicios: [{ nombre: 'Agua potable', icono: 'water' }, { nombre: 'Energía eléctrica', icono: 'bolt' }, { nombre: 'Gas natural', icono: 'gas' }, { nombre: 'Alcantarillado', icono: 'drain' }, { nombre: 'Vía pavimentada', icono: 'road' }, { nombre: 'Internet', icono: 'wifi' }],
    },
    {
      numero: 'C-01', manzana: 'C', area: 190, precio: 41000000,
      ubicacion: 'Sector Central', estado: 'disponible' as const,
      descripcion: 'Lote en corazón del proyecto, todos los servicios disponibles.',
      latitud: 4.1440, longitud: -73.6300,
      servicios: [{ nombre: 'Agua potable', icono: 'water' }, { nombre: 'Energía eléctrica', icono: 'bolt' }, { nombre: 'Gas natural', icono: 'gas' }, { nombre: 'Alcantarillado', icono: 'drain' }, { nombre: 'Vía pavimentada', icono: 'road' }],
    },
    {
      numero: 'C-02', manzana: 'C', area: 165, precio: 33000000,
      ubicacion: 'Sector Central, interior', estado: 'reservado' as const,
      descripcion: 'Lote de uso mixto, permite construcción residencial o comercial.',
      servicios: [{ nombre: 'Agua potable', icono: 'water' }, { nombre: 'Energía eléctrica', icono: 'bolt' }, { nombre: 'Alcantarillado', icono: 'drain' }],
    },
  ];

  for (const lote of lotes) {
    const { servicios, ...data } = lote;
    await prisma.lote.upsert({
      where: { numero: data.numero },
      update: {},
      create: { ...data, servicios: { create: servicios } },
    });
  }

  // Configuración del sitio (fila única id=1) — solo la crea si no existe,
  // para no pisar los textos que el admin haya editado.
  await prisma.siteConfig.upsert({
    where: { id: DEFAULT_SITE_CONFIG.id },
    update: {},
    create: DEFAULT_SITE_CONFIG,
  });

  console.log(`Seed completado. Admin creado: ${email}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
