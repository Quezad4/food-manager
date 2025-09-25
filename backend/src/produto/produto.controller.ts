import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';




@ApiTags("Produtos")
@ApiBearerAuth()

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @ApiOperation({summary: "Criar produto"})
  @Roles('admin')
  @Post()
  criar(@Body() dto: CreateProdutoDto) {
    return this.produtoService.criar(dto);
  }

  @ApiOperation({summary: "Listar produtos"})
  @Get()
  listarTodos() {
    return this.produtoService.listarTodos();
  }

  @ApiOperation({summary: "Produto por ID"})
  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.buscarPorId(id);
  }

  @ApiOperation({summary: "Atualizar produto"})
  @Roles('admin')
  @Patch(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProdutoDto) {
    return this.produtoService.atualizar(id, dto);
  }


  @ApiOperation({summary: "Exlcuir produto"})
  @Roles('admin')
  @Delete(':id')
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.remover(id);
  }
}
