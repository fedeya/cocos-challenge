import { z } from 'zod';

const envSchema = z.object({
  REDIS_URL: z.string().optional(),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

const safeParsingEnv = envSchema.safeParse(process.env);

if (!safeParsingEnv.success) {
  const errors = safeParsingEnv.error.flatten().fieldErrors;

  console.error('Invalid environment variables:', errors);

  throw new Error('Invalid environment variables');
}

export const env = envSchema.parse(process.env);
