import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutoService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(data: CreateProdutoDto) {
    return this.prisma.produto.create({ data });
  }

  async listarTodos() {
    return this.prisma.produto.findMany();
  }

  async buscarPorId(id: number) {
    const produto = await this.prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }
    return produto;
  }

  async atualizar(id: number, data: UpdateProdutoDto) {
    await this.buscarPorId(id); 
    return this.prisma.produto.update({
      where: { id },
      data,
    });
  }

  async remover(id: number) {
    await this.buscarPorId(id);
    return this.prisma.produto.delete({ where: { id } });
  }
}
