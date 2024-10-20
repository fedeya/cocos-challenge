import { serve } from '@hono/node-server';
import { initializeCore } from '@cocos-challenge/core';
import { app } from './app';
import { env } from './lib/env';

async function main() {
  try {
    await initializeCore({
      databaseUrl: env.DATABASE_URL,
    });

    console.log('Database connection is established');
  } catch (error) {
    console.error('Failed to initialize the database connection', error);
    process.exit(1);
  }

  console.log(`Server is running on port ${env.PORT}`);

  serve({
    fetch: app.fetch,
    port: env.PORT,
  });
}

main();
