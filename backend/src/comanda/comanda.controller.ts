// comanda/comanda.controller.ts
import { Body, Controller, Get, Param, Patch, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ComandaService } from './comanda.service';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { AdicionarItemDto } from './dto/create-comanda.dto';

import {ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()

@ApiTags("Comandas")
@Controller('comandas')
export class ComandaController {
  constructor(private service: ComandaService) { }

  @ApiOperation({ summary: "Abrir comanda" })
  @Post('abrir')
  abrir(@Body() dto: CreateComandaDto) { return this.service.abrir(dto.usuarioId); }

  @ApiOperation({ summary: "Adicionar item na comanda" })
  @Post('adicionar-item')
  adicionar(@Body() dto: AdicionarItemDto) {
    return this.service.adicionarItem(dto.comandaId, dto.produtoId, dto.quantidade);
  }

  // Controller
  @ApiOperation({summary: "Remover item na comanda"})
  @Patch(':comandaId/remover-item/:itemId')
  remover(
    @Param('comandaId') comandaId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.service.removerItem(+comandaId, +itemId);
  }

  @ApiOperation({summary: "Comanda por ID"})
    @Get(':id')
    buscarPorId(@Param('id', ParseIntPipe) id: number) {
      return this.service.buscarPorId(id);
    }

  @ApiOperation({summary: "Listar todas as comandas e seus itens"})
  @Get()
  listar() { return this.service.listar(); }

  @ApiOperation({summary: "Fechar comanda"})
  @Patch('fechar/:id')
  fechar(@Param('id') id: string) { return this.service.fechar(+id); }
}
