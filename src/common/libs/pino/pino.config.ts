import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import path from 'path';

export const getLoggerAsyncConfig = (config: ConfigService): Params => {
  const isProduction = config.get<string>('NODE_ENV') === 'production';

  // Base target: Always write to rotating files
  const targets: any[] = [
    {
      target: 'pino-roll',
      options: {
        file: path.join(process.cwd(), 'logs', 'app.log'),
        frequency: 'daily',
        mkdir: true,
        limit: { count: 30 },
        extension: '.log',
      },
    },
  ];

  // Only add pretty console logs in Development
  if (!isProduction) {
    targets.push({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
        ignore: 'pid,hostname',
      },
    });
  }

  return {
    pinoHttp: {
      autoLogging: true,
      transport: { targets },
    },
  };
};
