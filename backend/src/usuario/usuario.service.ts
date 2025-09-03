import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

const selectPublic = {
  id: true, nome: true, cargo: true, telefone: true, foto: true, user: true, isAdmin: true,
};

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateUsuarioDto) {
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    try {
      return await this.prisma.usuario.create({
        data: {
          nome: dto.nome,
          cargo: dto.cargo ?? "",
          telefone: dto.telefone ?? null,
          foto: dto.foto ?? null,
          user: dto.user,
          senha: senhaHash,
          isAdmin: dto.isAdmin ?? false,
        },
        select: selectPublic,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Nome de usuário já está em uso.');
      }
      throw e;
    }
  }

  findAll() {
    return this.prisma.usuario.findMany({ orderBy: { id: 'desc' }, select: selectPublic });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id }, select: selectPublic });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const data: Prisma.UsuarioUpdateInput = {
      ...(dto.nome !== undefined && { nome: dto.nome }),
      ...(dto.cargo !== undefined && { cargo: dto.cargo }),
      ...(dto.telefone !== undefined && { telefone: dto.telefone }),
      ...(dto.foto !== undefined && { foto: dto.foto }),
      ...(dto.user !== undefined && { user: dto.user }),
      ...(dto.isAdmin !== undefined && { isAdmin: dto.isAdmin }),
    };
    if (dto.senha !== undefined) {
      data.senha = await bcrypt.hash(dto.senha, 10);
    }
    try {
      return await this.prisma.usuario.update({ where: { id }, data, select: selectPublic });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Nome de usuário já está em uso.');
      }
      throw e;
    }
  }

  remove(id: number) {
    return this.prisma.usuario.delete({ where: { id }, select: selectPublic });
  }

  async findByUser(user: string) {
    return this.prisma.usuario.findUnique({ where: { user } });
  }
}
