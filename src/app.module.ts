import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, appConfigValidationSchema } from '#common/config/configs/app.config.js';
import { databaseConfig, databaseConfigValidationSchema } from '#common/config/configs/database.config.js';
import Joi from 'joi';
import { UserModule } from '#modules/user/user.module.js';
import { PrismaModule } from '#common/infrastructure/database/prisma.module.js';
import { WorkflowEngineModule } from '#modules/workflow-engine/workflow-engine.module.js';

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

    PrismaModule,
    UserModule,
    WorkflowEngineModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
