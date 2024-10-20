import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { PortfolioService } from '@/services/portfolio';

export const portfolio = new OpenAPIHono();

const route = createRoute({
  path: '/',
  method: 'get',
  tags: ['Portfolio'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            availableCash: z.number(),
            totalAccountValue: z.number(),
            positions: z
              .object({
                name: z.string(),
                instrumentId: z.number(),
                ticker: z.string(),
                totalUnits: z.number(),
                performancePercentage: z.number(),
                currentPrice: z.number(),
                totalValue: z.number(),
              })
              .array(),
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
