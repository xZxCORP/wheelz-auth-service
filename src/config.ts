import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(3306),
  DB_USERNAME: z.string().default('wheelz'),
  DB_PASSWORD: z.string().default('root'),
  DB_NAME: z.string().default('auth_service_db'),
  USER_SERVICE_URL: z.string().default('localhost:4000'),
});
const parsedConfig = configSchema.safeParse(process.env);
if (!parsedConfig.success) {
  throw new Error('Invalid configuration');
}

export const config = parsedConfig.data;
