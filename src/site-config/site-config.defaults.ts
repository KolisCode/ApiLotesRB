/**
 * Valores por defecto de la configuración del sitio = el contenido que antes
 * vivía hardcodeado en el frontend. Sin dependencias de Nest para poder
 * reutilizarlo tanto en el service como en el seed de Prisma.
 */
export const DEFAULT_SITE_CONFIG = {
  id: 1,
  whatsappNumber: '573000000000',
  telefono: '+57 300 000 0000',
  email: 'contacto@lotesrb.com',
  direccion: 'Colombia',
  horario: 'Lunes a sábado · 8:00 a.m. – 6:00 p.m.',
  marca: 'TuLote',
  tagline: 'Tu terreno, tu futuro.',
  heroEyebrow: 'Proyecto residencial · Lotes desde 160 m²',
  heroTitulo: 'Tu terreno propio, al alcance de tu mano',
  heroSubtitulo: 'Lotes con todos los servicios, escrituración garantizada y financiación directa sin banco.',
  heroImagen: null as string | null,
  ventajas: [
    { icono: '📄', titulo: 'Escrituración garantizada', desc: 'Todos los lotes cuentan con escritura pública y registro en Instrumentos Públicos.' },
    { icono: '💧', titulo: 'Servicios disponibles', desc: 'Agua potable, energía, alcantarillado y vías de acceso en cada sector.' },
    { icono: '📍', titulo: 'Excelente ubicación', desc: 'Zona de alta valorización, conectada a vías principales y centros urbanos.' },
    { icono: '💰', titulo: 'Financiación directa', desc: 'Cuota inicial y saldo en cómodas cuotas. Sin banco, sin trámites complicados.' },
  ],
  proyectoMunicipio: 'Villavicencio, Meta',
  proyectoNombre: 'Lotes El Bosque',
  proyectoDescripcion: 'Un desarrollo pensado para que cada familia tenga su propio terreno, con servicios completos y respaldo legal garantizado.',
  distancias: [
    { icono: '🏫', lugar: 'Colegio más cercano', detalle: '5 min · 2 km' },
    { icono: '🏪', lugar: 'Supermercado / comercio', detalle: '7 min · 3 km' },
    { icono: '🏥', lugar: 'Centro de salud', detalle: '10 min · 4 km' },
    { icono: '🚌', lugar: 'Transporte público', detalle: '3 min caminando' },
    { icono: '🏙️', lugar: 'Centro urbano más cercano', detalle: '15 min · 8 km' },
  ],
  infraestructura: [
    { icono: '💧', nombre: 'Agua potable' },
    { icono: '⚡', nombre: 'Energía eléctrica' },
    { icono: '🚰', nombre: 'Alcantarillado' },
    { icono: '🔥', nombre: 'Gas natural' },
    { icono: '🛣️', nombre: 'Vías pavimentadas' },
    { icono: '📶', nombre: 'Internet disponible' },
    { icono: '🌳', nombre: 'Zonas verdes' },
    { icono: '💡', nombre: 'Alumbrado público' },
  ],
  pasos: [
    { icono: '🔍', titulo: 'Elige tu lote', desc: 'Revisa el catálogo, filtra por área y precio, y agenda una visita al terreno para conocerlo en persona. Te acompañamos en el recorrido.' },
    { icono: '📋', titulo: 'Aparta con cuota inicial', desc: 'Con un pago de separación acordado, el lote queda reservado a tu nombre mientras se preparan los documentos. Sin costos ocultos.' },
    { icono: '🤝', titulo: 'Firma la promesa', desc: 'Se firma la promesa de compraventa con todos los términos acordados: precio total, cuotas y fecha de escrituración.' },
    { icono: '📄', titulo: 'Escrituración y entrega', desc: 'Se hace la escritura pública ante notaría y el registro en la Oficina de Instrumentos Públicos. El lote queda a tu nombre, listo para construir.' },
  ],
  financiacionTitulo: 'Financiación directa con el vendedor',
  financiacionTexto: 'No necesitas banco. Manejamos cuota inicial y saldo en cuotas mensuales acordadas directamente. Consulta las condiciones sin compromiso.',
};
