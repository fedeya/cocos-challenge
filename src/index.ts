import { serve } from '@hono/node-server';
import { dataSource } from './config/datasource';
import { app } from './app';

async function main() {
  try {
    const { isInitialized } = await dataSource.initialize();

    if (!isInitialized) {
      console.error('Failed to initialize the database connection');
      process.exit(1);
    }

    console.log('Database connection is established');
  } catch (error) {
    console.error('Failed to initialize the database connection', error);
    process.exit(1);
  }

  const port = 3000;

  console.log(`Server is running on port ${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
}

main();
