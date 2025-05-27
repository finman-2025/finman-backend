import './instrument'

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import * as compression from 'compression';

import { AppConfig } from './config/app.config';

import { AppModule } from './app.module';
import { useSwagger } from './common/swagger';
import { colors } from './common/colors';

async function bootstrap() {
  const logger = new Logger('Application', { timestamp: true });

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.setGlobalPrefix('api', { exclude: ['/'] });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.use(urlencoded({ extended: true, limit: appConfig.payloadLimit }));
  app.use(json({ limit: appConfig.payloadLimit }));
  app.use(compression());

  useSwagger(app);

  await app.listen(appConfig.port, appConfig.host, async () => {
    logger.log(
      `is running on: ${colors.FgWhite}${await app.getUrl()} ${colors.FgCyan}[${appConfig.env}]`,
    );
  });
}

void bootstrap();
