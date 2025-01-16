import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Tvarkau Lietuva API')
    .setDescription('API skirtas Tvarkau Lietuva projektui')
    .setVersion('1.0')
    .addBearerAuth({
      description: 'Please enter token in following format: Bearer <JWT>',
      bearerFormat: 'JWT',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}

bootstrap();
