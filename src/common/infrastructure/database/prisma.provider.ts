import { ConfigService } from '@nestjs/config';
import { Injectable, Scope } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/prisma/client.js';
import { DatabaseConfigs } from '@common/config/configs/database.config.js';

@Injectable({ scope: Scope.DEFAULT })
export class PrismaProvider extends PrismaClient {
  constructor(configService: ConfigService<Configs>) {
    const config = configService.getOrThrow<DatabaseConfigs>('app');

    const adapter = new PrismaBetterSqlite3({ url: config.DATABASE_URL });

    super({ adapter });
  }
}

/* import {
  AppConfig,
  ConfigType,
} from '../../../../../../Atie Projects/wiki/service/src/common/config/config.type.js';
import { ConfigService } from '@nestjs/config';
import { Injectable, Scope } from '@nestjs/common';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable({ scope: Scope.DEFAULT })
export class PrismaProvider extends PrismaClient {
  constructor(configService: ConfigService<ConfigType>) {
    const config = configService.getOrThrow<AppConfig>('app');

    // Use the MSSQL adapter
    const adapter = new PrismaMssql(config.DATABASE_URL, {
      onConnectionError: (err) => {
        console.log(err);
      },
    });

    super({ adapter });
  }
}
 */
