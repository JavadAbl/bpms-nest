import process from 'node:process';
import { ConfigType, registerAs } from '@nestjs/config';
import Joi from 'joi';

export const databaseConfigValidationSchema = {
  DATABASE_URL: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
};

export const databaseConfig = registerAs('database', () => ({
  DATABASE_URL: process.env.DB_HOST,
  DATABASE_NAME: process.env.DB_HOST,
}));

export type DatabaseConfigs = ConfigType<typeof databaseConfig>;
