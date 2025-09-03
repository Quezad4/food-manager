import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutoModule } from './produto/produto.module';
import { ProdutoService } from './produto/produto.service';
import { ProdutoController } from './produto/produto.controller';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [AuthModule, PrismaModule, ProdutoModule, UsuarioModule],
  controllers: [AppController, ProdutoController],
  providers: [AppService, ProdutoService,],
})
export class AppModule {}
