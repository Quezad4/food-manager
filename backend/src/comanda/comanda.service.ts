// comanda/comanda.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ComandaService {
  constructor(private prisma: PrismaService) {}

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
      const subtotal = precoUnitario.mul(quantidade);

      await tx.itemComanda.create({
        data: { comandaId, produtoId, quantidade, precoUnitario, subtotal },
      });

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
    const comanda = await tx.comanda.findUnique({ where: { id: comandaId } });
    
    if (!item) throw new NotFoundException('Item não encontrado');

    if (item.comandaId !== comandaId) {
      throw new BadRequestException('Item não pertence à comanda informada');
    }
    if (!comanda || comanda.status !== 'ABERTA') throw new BadRequestException('Comanda inválida ou não está aberta');

    await tx.itemComanda.delete({ where: { id: itemId } });

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
