import { OrdersService } from '@/services/orders';
import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { z } from 'zod';

export const orders = new OpenAPIHono();

const responseOrderSchema = z.object({
  order: z.object({
    id: z.number(),
    userId: z.number(),
    instrumentId: z.number(),
    side: z.string(),
    type: z.string(),
    status: z.string(),
    price: z.number().optional(),
    datetime: z.date(),
  }),
});

const assetRoute = createRoute({
  method: 'post',
  tags: ['Orders'],
  path: '/asset',
  summary: 'Buy or Sell an Asset',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .union([
              z.object({
                type: z.literal('MARKET'),
              }),
              z.object({
                type: z.literal('LIMIT'),
                price: z.number(),
              }),
            ])
            .and(
              z.object({
                amount: z.number(),
                amountType: z
                  .union([z.literal('CASH'), z.literal('UNITS')])
                  .default('UNITS'),
                side: z.union([z.literal('BUY'), z.literal('SELL')]),
                instrumentId: z.number(),
              }),
            ),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: responseOrderSchema,
        },
      },
    },
  },
});

orders.openapi(assetRoute, async (c) => {
  const userId = 3;

  const body = c.req.valid('json');

  const order = await OrdersService.send({
    ...body,
    userId,
  });

  return c.json({
    order,
  });
});

const cashRoute = createRoute({
  method: 'post',
  tags: ['Orders'],
  path: '/cash',
  summary: 'Cash In or Cash Out',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            amount: z.number(),
            currency: z.string(),
            side: z.union([z.literal('CASH_IN'), z.literal('CASH_OUT')]),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: responseOrderSchema,
        },
      },
    },
  },
});

orders.openapi(cashRoute, async (c) => {
  const body = c.req.valid('json');

  const userId = 3;

  const order =
    body.side === 'CASH_IN'
      ? await OrdersService.cashIn({
          userId,
          amount: body.amount,
          currency: body.currency,
        })
      : await OrdersService.cashOut({
          userId,
          amount: body.amount,
          currency: body.currency,
        });

  return c.json({
    order,
  });
});
