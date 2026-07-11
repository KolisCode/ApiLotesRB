-- AlterTable: slug URL-amigable (nullable + único). Se rellena en código (create/update)
-- y por backfill; NULL permitido para poder añadir la columna a tablas ya pobladas.
ALTER TABLE "Lote" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Lote_slug_key" ON "Lote"("slug");
