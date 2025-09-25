// src/auth/roles.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const handler = ctx.getHandler();

    const requiredRoles = this.reflector.get<string[]>('roles', handler);
    if (!requiredRoles || requiredRoles.length === 0) return true; 

    const user = req.user; 
    if (!user) throw new ForbiddenException('Não autenticado');

    const roleDoUsuario = user.isAdmin ? 'admin' : 'user';
    if (!requiredRoles.includes(roleDoUsuario)) {
      throw new ForbiddenException('Acesso negado: permissão insuficiente');
    }
    return true;
  }
}
