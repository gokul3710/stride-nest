import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { domains } from './constants/domains';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: process.env.CORS_ORIGIN.split(','),
    methods: process.env.CORS_METHODS.split(','),
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT);
}
bootstrap();
