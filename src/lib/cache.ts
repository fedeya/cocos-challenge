import { LRUCache } from 'lru-cache';
import { createClient } from 'redis';
import { env } from './env';

interface Cache {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl: number): Promise<void>;
  has(key: string): Promise<boolean>;
}

declare global {
  var __cache: Cache;
}

function createLRUCache(): Cache {
  const cache = new LRUCache({
    max: 1000,
    ttl: 1000 * 60 * 5, // 5 minutes
  });

  return {
    get: async (key: string) => cache.get(key),
    set: async (key: string, value: any, ttl: number) => {
      cache.set(key, value, { ttl });
    },
    has: async (key: string) => cache.has(key),
  };
}

const redisClient = createClient({
  url: env.REDIS_URL,
});

async function createRedisCache(): Promise<Cache> {
  await redisClient.connect();

  return {
    get: async (key: string) => {
      const data = await redisClient.get(key);

      return data ? JSON.parse(data) : null;
    },
    set: async (key: string, value: any, ttl: number) => {
      await redisClient.set(key, JSON.stringify(value), {
        EX: ttl / 1000,
      });
    },
    has: async (key: string) => {
      const exists = await redisClient.exists(key);

      return exists === 1;
    },
  };
}

export async function getCache(): Promise<Cache> {
  if (!global.__cache) {
    try {
      global.__cache = await createRedisCache();
    } catch (error) {
      console.error('Failed to create Redis cache', error);
      console.log('Falling back to in-memory cache');

      global.__cache = createLRUCache();
    }
  }

  return global.__cache;
}
