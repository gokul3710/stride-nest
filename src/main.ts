import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { domains } from './constants/domains';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: [domains.DOMAIN, domains.DOMAIN_2,domains.DOMAIN_LOCALHOST, domains.ADMIN_DOMAIN, domains.ADMIN_DOMAIN_2,domains.ADMIN_DOMAIN_LOCALHOST],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    credentials: true, 
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT);
}
bootstrap();
