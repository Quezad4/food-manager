// auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { UsuarioService } from 'src/usuario/usuario.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsuarioService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.user, dto.senha);
  }

  // registro opcional por aqui; pode ficar também em UsuarioController
  @Post('register')
  register(@Body() dto: CreateUsuarioDto) {
    return this.users.create(dto);
  }
}
