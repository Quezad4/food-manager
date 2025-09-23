// comanda/comanda.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ComandaService {
  constructor(private prisma: PrismaService) { }

  async abrir(usuarioId: number) {
    // valida se usuário existe
    const user = await this.prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!user) throw new NotFoundException('Usuário inexistente');
    return this.prisma.comanda.create({ data: { usuarioId } });
  }

  async adicionarItem(comandaId: number, produtoId: number, quantidade: number) {
    return this.prisma.$transaction(async (tx) => {
      const comanda = await tx.comanda.findUnique({ where: { id: comandaId } });
      if (!comanda || comanda.status !== 'ABERTA') throw new BadRequestException('Comanda inválida ou não está aberta');

      const produto = await tx.produto.findUnique({ where: { id: produtoId } });
      if (!produto) throw new NotFoundException('Produto inexistente');


      const precoUnitario = new Prisma.Decimal(produto.preco);

      // tenta achar item já existente dessa comanda para esse produto
      const existente = await tx.itemComanda.findUnique({
        where: { comandaId_produtoId: { comandaId, produtoId } }, // usa o @@unique
      });

      if (existente) {
        // soma quantidades e recalcula subtotal (mantém o mesmo precoUnitario do produto)
        const novaQuantidade = existente.quantidade + quantidade;
        const novoSubtotal = precoUnitario.mul(novaQuantidade);

        await tx.itemComanda.update({
          where: { comandaId_produtoId: { comandaId, produtoId } },
          data: { quantidade: novaQuantidade, subtotal: novoSubtotal },
        });
      } else {

        const subtotal = precoUnitario.mul(quantidade);
        await tx.itemComanda.create({
          data: { comandaId, produtoId, quantidade, precoUnitario, subtotal },
        });
      }

      // recalcula o total da comanda (seguro e simples)
      const agg = await tx.itemComanda.aggregate({
        where: { comandaId },
        _sum: { subtotal: true },
      });

      return tx.comanda.update({
        where: { id: comandaId },
        data: { total: agg._sum.subtotal ?? new Prisma.Decimal(0) },
      });
    });
  }

  // Service
  async removerItem(comandaId: number, itemId: number) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.itemComanda.findUnique({ where: { id: itemId } });
      if (!item) throw new NotFoundException('Item não encontrado');
      if (item.comandaId !== comandaId) {
        throw new BadRequestException('Item não pertence à comanda informada');
      }
      const comanda = await tx.comanda.findUnique({ where: { id: comandaId } });
      if (!comanda || comanda.status !== 'ABERTA') throw new BadRequestException('Comanda inválida ou não está aberta');

      if (item.quantidade > 1) {
        const novaQtd = item.quantidade - 1;
        // mantém o mesmo preço unitário e recalcula subtotal
        const novoSubtotal = item.precoUnitario.mul(novaQtd);
        await tx.itemComanda.update({
          where: { id: itemId },
          data: { quantidade: novaQtd, subtotal: novoSubtotal },
        });
      } else {
        await tx.itemComanda.delete({ where: { id: itemId } });
      }

      // Recalcula total da comanda
      const agg = await tx.itemComanda.aggregate({
        where: { comandaId },
        _sum: { subtotal: true },
      });

      return tx.comanda.update({
        where: { id: comandaId },
        data: { total: agg._sum.subtotal ?? new Prisma.Decimal(0) },
      });
    });
  }




  listar() {
    return this.prisma.comanda.findMany({
      orderBy: { id: 'desc' },
      include: { itens: true, usuario: { select: { id: true, nome: true, user: true } } },
    });
  }

  async fechar(comandaId: number) {
    const comanda = await this.prisma.comanda.findUnique({ where: { id: comandaId } });
    if (!comanda) throw new NotFoundException('Comanda não encontrada');
    if (comanda.status !== 'ABERTA') throw new BadRequestException('Comanda não está aberta');

    return this.prisma.comanda.update({
      where: { id: comandaId },
      data: { status: 'FECHADA', fechadaEm: new Date() },
    });
  }
}
