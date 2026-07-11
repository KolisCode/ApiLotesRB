/** Convierte texto a slug URL-safe: sin acentos, minúsculas, guiones. */
export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')      // quita acentos (marcas diacríticas)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')          // no-alfanumérico → guion
    .replace(/^-+|-+$/g, '');             // recorta guiones extremos
}

/**
 * Slug descriptivo y único de un lote: `lote-{numero}-{ubicacion}`.
 * Como `numero` es único y va en el slug, el resultado es único sin necesidad de dedup.
 * Se limita la parte de ubicación a ~4 palabras para no alargar la URL.
 */
export function slugLote(numero: string, ubicacion: string): string {
  const base = `lote-${slugify(numero)}`;
  const extra = slugify(ubicacion).split('-').filter(Boolean).slice(0, 4).join('-');
  return extra ? `${base}-${extra}` : base;
}
