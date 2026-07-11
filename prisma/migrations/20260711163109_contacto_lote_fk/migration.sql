-- Saneamiento previo: antes de esta migración loteId no tenía FK, así que borrar un lote
-- podía dejar contactos con loteId apuntando a un lote inexistente (huérfanos). Postgres
-- valida las filas existentes al crear la constraint, por lo que hay que anularlos primero
-- o el ADD CONSTRAINT aborta el deploy.
UPDATE "Contacto" SET "loteId" = NULL
WHERE "loteId" IS NOT NULL
  AND "loteId" NOT IN (SELECT "id" FROM "Lote");

-- AddForeignKey
ALTER TABLE "Contacto" ADD CONSTRAINT "Contacto_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
