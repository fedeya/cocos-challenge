import { initializeDB, dataSource } from '@cocos-challenge/db';
import fs from 'fs/promises';

// Connect to the database and seed it with the contents of database.sql
beforeAll(async () => {
  await initializeDB({
    mode: 'test',
  });

  const seed = await fs.readFile('./database.sql', 'utf-8');

  const queries = seed.split(';').filter((q) => q.trim().length > 0);

  await Promise.all(
    queries.map(async (query) => {
      await dataSource.query(query).catch((err) => {
        console.log('Error seeding database:', err);
        console.log('Query:', query);
      });
    }),
  );
});
