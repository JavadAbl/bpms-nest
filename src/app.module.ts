import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { getLoggerAsyncConfig } from '#common/libs/pino/pino.config.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, appConfigValidationSchema } from '#common/config/configs/app.config.js';
import { databaseConfig, databaseConfigValidationSchema } from '#common/config/configs/database.config.js';
import Joi from 'joi';
import { I18nModule } from 'nestjs-i18n';
import { getI18nConfig } from '#common/libs/i18n/i18n.config.js';
import { UserModule } from '#modules/user/user.module.js';
import { PrismaModule } from '#common/infrastructure/database/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validationSchema: Joi.object({ ...appConfigValidationSchema, ...databaseConfigValidationSchema }),
      validationOptions: {
        libraryOptions: {
          allowUnknown: true, // Allows variables not defined in schema
          abortEarly: true, // Stops validation on the first error
        },
      },
    }),

    /*    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getLoggerAsyncConfig,
    }), */

    // I18nModule.forRoot(getI18nConfig()),
    PrismaModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
