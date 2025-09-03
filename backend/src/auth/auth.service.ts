import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(private users: UsuarioService, private jwt: JwtService) {}

  async validateUser(user: string, senha: string) {
    const found = await this.users.findByUser(user);
    if (!found) throw new UnauthorizedException('Credenciais inválidas');
    const ok = await bcrypt.compare(senha, found.senha);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');
    const { senha: _, ...pub } = found;
    return pub;
  }

  async login(user: string, senha: string) {
    const pub = await this.validateUser(user, senha);
    const payload = { sub: pub.id, user: pub.user, isAdmin: pub.isAdmin };
    return {
      access_token: await this.jwt.signAsync(payload),
      user: pub,
    };
  }
}
