import {
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_ENDPOINT,
  SWAGGER_DESCRIPTION,
  SWAGGER_TITLE,
} from '#common/constants/swagger.const.js';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './swagger.plugin.js';
import { Configs } from '#common/config/config.type.js';

export function setupSwagger(app: INestApplication, configService: ConfigService<Configs, true>) {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .addBearerAuth()
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refreshToken')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'apiKey')
    .build();

  const document = SwaggerModule.createDocument(app, options, {});

  SwaggerModule.setup(SWAGGER_API_ENDPOINT, app, document, { explorer: true, swaggerOptions });
}
