import process from 'node:process';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import {
  databaseConfig,
  databaseConfigValidationSchema,
} from './configs/database.config.js';
import { appConfig, appConfigValidationSchema } from './configs/app.config.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/env/.env.${process.env.NODE_ENV}`],
      load: [appConfig, databaseConfig],
      cache: true,
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        ...appConfigValidationSchema,
        ...databaseConfigValidationSchema,
      }),
      validationOptions: {
        libraryOptions: {
          abortEarly: true,
          cache: !AppConfigModule.isProd(),
          debug: !AppConfigModule.isProd(),
          stack: !AppConfigModule.isProd(),
        },
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppConfigModule {
  public static isProd(): boolean {
    return process?.env?.NODE_ENV?.startsWith('prod') ?? false;
  }

  public static isDev(): boolean {
    return process?.env?.NODE_ENV?.startsWith('dev') ?? true;
  }
}
