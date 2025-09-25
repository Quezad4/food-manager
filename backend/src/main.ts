import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
    .setTitle('FoodManager API')
    .setDescription('API para gerenciamento de restaurante (usuarios, produtos, comandas)')
    .setVersion('1.0.0')
    .addBearerAuth() // habilita botão Authorize com JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); 
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
