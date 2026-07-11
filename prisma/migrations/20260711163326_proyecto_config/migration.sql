-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "distancias" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "financiacionTexto" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "financiacionTitulo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "infraestructura" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "pasos" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "proyectoDescripcion" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "proyectoMunicipio" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "proyectoNombre" TEXT NOT NULL DEFAULT '';
