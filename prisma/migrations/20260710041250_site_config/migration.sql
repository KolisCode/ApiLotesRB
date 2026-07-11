-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "whatsappNumber" TEXT NOT NULL DEFAULT '573000000000',
    "telefono" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "direccion" TEXT NOT NULL DEFAULT '',
    "horario" TEXT NOT NULL DEFAULT '',
    "marca" TEXT NOT NULL DEFAULT 'LotesRB',
    "tagline" TEXT NOT NULL DEFAULT '',
    "heroEyebrow" TEXT NOT NULL DEFAULT '',
    "heroTitulo" TEXT NOT NULL DEFAULT '',
    "heroSubtitulo" TEXT NOT NULL DEFAULT '',
    "heroImagen" TEXT,
    "ventajas" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);
