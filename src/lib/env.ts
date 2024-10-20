import { z } from 'zod';

const envSchema = z.object({
  REDIS_URL: z.string().optional(),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3000),
});

export const env = envSchema.parse(process.env);
