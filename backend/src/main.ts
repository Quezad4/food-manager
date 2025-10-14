import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
    .setTitle('FoodManager API')
    .setDescription('API para gerenciamento de restaurante (usuarios, produtos, comandas)')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

    app.enableCors({
      origin: [
        'http://localhost:5173',
        'http://192.168.0.113:5173', // IP do Vite na rede
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: '*',
      credentials: false, 
    })
  
    

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); 
  await app.listen(3001, '0.0.0.0') // porta e host corretos
}
bootstrap();
