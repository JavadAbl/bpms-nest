import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const APP_NAME = packageJson.name;
export const SWAGGER_API_CURRENT_VERSION = packageJson.version;
export const SWAGGER_DESCRIPTION = packageJson.description;
export const SWAGGER_TITLE = `${capitalize(APP_NAME)} API Documentation`;
export const SWAGGER_API_ENDPOINT = 'doc';
