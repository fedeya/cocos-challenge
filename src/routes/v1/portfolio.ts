import { createRoute, z } from '@hono/zod-openapi';
import { PortfolioService } from '@/services/portfolio';
import { honoApp } from '@/lib/hono';

export const portfolio = honoApp();

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
  const userId = 3;

  const data = await PortfolioService.retrieve(userId);

  return c.json(data);
});
