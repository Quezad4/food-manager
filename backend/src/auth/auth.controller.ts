// auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @ApiOperation({ summary: 'Faz a requisição de Login (retorna hash JWT caso credencial correta)' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.user, dto.senha);
  }

}
