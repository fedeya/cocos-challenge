import { createRoute, z } from '@hono/zod-openapi';
import { PortfolioService } from '@cocos-challenge/core';
import { honoApp } from '@/lib/hono';
import { cookieAuth } from '@/middlewares/auth';
import invariant from 'tiny-invariant';

export const portfolio = honoApp();

portfolio.use(cookieAuth);

const positionSchema = z
  .object({
    name: z.string(),
    instrumentId: z.number(),
    ticker: z.string(),
    totalUnits: z.number(),
    performancePercentage: z.number(),
    currentPrice: z.number(),
    totalValue: z.number(),
  })
  .openapi('Position');

const route = createRoute({
  path: '/',
  method: 'get',
  tags: ['Portfolio'],
  summary: 'Retrieve User Portfolio',
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            availableCash: z.number(),
            totalAccountValue: z.number(),
            positions: positionSchema.array(),
          }),
        },
      },
      description: 'Success',
    },
  },
});

portfolio.openapi(route, async (c) => {
  const userId = c.get('userId');

  invariant(typeof userId !== 'undefined', 'userId is required');

  const data = await PortfolioService.retrieve(userId);

  return c.json(data);
});
