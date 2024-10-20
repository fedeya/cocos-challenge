import { getCache } from '@/lib/cache';
import { honoApp } from '@/lib/hono';
import { InstrumentsService } from '@/services/instruments';
import { createRoute, z } from '@hono/zod-openapi';

export const instruments = honoApp();

const instrumentSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    ticker: z.string(),
    type: z.string(),
  })
  .openapi('Instrument');

const route = createRoute({
  method: 'get',
  path: '/search',
  tags: ['Instruments'],
  summary: 'Search for Instruments',
  request: {
    query: z.object({
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
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: z.object({
            info: z.object({
              total: z.number(),
              limit: z.number(),
              page: z.number(),
              nextPage: z.number().optional(),
              hasMore: z.boolean(),
            }),
            instruments: instrumentSchema.array(),
          }),
        },
      },
    },
  },
});

instruments.openapi(route, async (c) => {
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
});
