import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { corsOptions } from './common/constants/cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT ?? 3001);
  Logger.log(`Server running on: ${await app.getUrl()}`);
}
bootstrap();
