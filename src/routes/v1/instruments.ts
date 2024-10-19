import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getCache } from '@/lib/cache';
import { InstrumentsService } from '@/services/instruments';

export const instruments = new Hono();

instruments.get(
  '/search',
  zValidator(
    'query',
    z.object({
      q: z.string().min(1),
      limit: z.coerce.number().optional().default(10),
      page: z.coerce.number().optional().default(0),
      filter: z
        .enum(['name', 'ticker'])
        .array()
        .optional()
        .default(['name', 'ticker'])
        .or(z.enum(['name', 'ticker'])),
    }),
  ),
  async (c) => {
    const { limit, page, q, filter } = c.req.valid('query');

    c.header('Cache-Control', 'public, max-age=300');

    const filterArray = Array.isArray(filter) ? filter : [filter];

    const cacheKey = `${q}-${limit}-${page}-${filterArray.join('-')}`;

    const cache = await getCache();

    const cachedData = await cache.get(cacheKey);

    if (cachedData) {
      console.log('Cache hit!');

      return c.json(cachedData);
    }

    const res = await InstrumentsService.search({
      query: q,
      limit,
      filter: filterArray,
      page,
    });

    await cache.set(cacheKey, res, 1000 * 60 * 5 /* 5 minutes */);

    return c.json(res);
  },
);
