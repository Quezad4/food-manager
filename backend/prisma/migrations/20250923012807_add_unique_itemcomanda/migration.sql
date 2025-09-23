/*
  Warnings:

  - A unique constraint covering the columns `[comandaId,produtoId]` on the table `item_comanda` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "item_comanda_comandaId_produtoId_key" ON "item_comanda"("comandaId", "produtoId");
