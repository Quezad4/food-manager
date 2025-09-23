import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';



@ApiTags("Usuarios")
@ApiBearerAuth()


@Controller('usuario')
@UseGuards(JwtAuthGuard)

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }


  @ApiOperation({ summary: "Criar usuario" })
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @ApiOperation({ summary: "Listar usuarios" })
  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @ApiOperation({ summary: "Usuario por ID" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @ApiOperation({ summary: "Atualizar usuario" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @ApiOperation({ summary: "Remover usuario" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
