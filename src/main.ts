import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigModule } from '@common/config/config.module.js';
import { setupSwagger } from '@common/libs/swagger/swagger.js';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import helmet from 'helmet';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Configs } from '@common/config/config.type.js';
import { i18nValidationErrorFactory, I18nValidationExceptionFilter } from 'nestjs-i18n';
import chalk from 'chalk';

declare const module: { hot: { accept: () => void; dispose: (argument: () => Promise<void>) => void } };

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    snapshot: true,
    bufferLogs: true,
    //  logger: new InternalDisabledLogger(),
  });

  // =========================================================
  // Replace the default NestJS logger with Pino
  // =========================================================
  app.useLogger(app.get(Logger));

  app.set('query parser', 'extended');

  const configService = app.get(ConfigService<Configs, true>);

  // =========================================================
  // configure swagger
  // =========================================================

  if (!AppConfigModule.isProd()) setupSwagger(app, configService);

  // ======================================================
  // security and middlewares
  // ======================================================

  app.enable('trust proxy');
  app.set('etag', 'strong');

  if (!AppConfigModule.isProd()) {
    app.use(compression());
    app.use(helmet());
  }
  // =====================================================
  // configure global pipes, filters, interceptors
  // =====================================================
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      validateCustomDecorators: true,
      enableDebugMessages: AppConfigModule.isDev(),
      exceptionFactory: i18nValidationErrorFactory,
    }),
  );

  app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false }));

  // =========================================================
  // configure shutdown hooks
  // =========================================================

  app.enableShutdownHooks();

  process.on('SIGINT', async () => {
    await gracefulShutdown(app, 'SIGINT');
  });

  process.on('SIGTERM', async () => {
    await gracefulShutdown(app, 'SIGTERM');
  });

  // useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if (module?.hot) {
    module.hot.accept();
    module.hot.dispose(async () => app.close());
  }

  const port = process.env.PORT ?? configService.get('app.port', { infer: true })!;

  await app.listen(port);

  const appUrl = `http://localhost:${port}/${globalPrefix}`;

  logger.log(`==========================================================`);
  logger.log(`🚀 Application is running on: ${chalk.green(appUrl)}`);

  logger.log(`==========================================================`);
  logger.log(
    `🚦 Accepting request only from: ${chalk.green(
      `${configService.get('app.allowedOrigins', { infer: true }).toString()}`,
    )}`,
  );

  if (!AppConfigModule.isProd()) {
    const swaggerUrl = `http://localhost:${port}/doc`;
    logger.log(`==========================================================`);
    logger.log(`📑 Swagger is running on: ${chalk.green(swaggerUrl)}`);
  }

  async function gracefulShutdown(app: INestApplication, code: string) {
    setTimeout(() => process.exit(1), 5000);
    logger.verbose(`Signal received with code ${code} ⚡.`);
    logger.log('❗Closing http server with grace.');

    try {
      await app.close();
      logger.log('✅ Http server closed.');
      process.exit(0);
    } catch (error: any) {
      logger.error(`❌ Http server closed with error: ${error}`);
      process.exit(1);
    }
  }
}

try {
  (async () => bootstrap())();
} catch (error) {
  logger.error(error);
}
