-- AddForeignKey
ALTER TABLE "Contacto" ADD CONSTRAINT "Contacto_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
