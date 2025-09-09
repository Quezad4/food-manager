-- CreateEnum
CREATE TYPE "StatusComanda" AS ENUM ('ABERTA', 'FECHADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "comanda" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "status" "StatusComanda" NOT NULL DEFAULT 'ABERTA',
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechadaEm" TIMESTAMP(3),
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_comanda" (
    "id" SERIAL NOT NULL,
    "comandaId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "item_comanda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_comanda" ADD CONSTRAINT "item_comanda_comandaId_fkey" FOREIGN KEY ("comandaId") REFERENCES "comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_comanda" ADD CONSTRAINT "item_comanda_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
