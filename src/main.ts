import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // agregar esta linea para que funcione la dependencia de class validator

  await app.listen(process.env.PORT ?? 3000, '192.168.100.12');
}
bootstrap();
