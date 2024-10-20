import { honoApp } from '@/lib/hono';
import { cookieAuth } from '@/middlewares/auth';
import { OrdersService } from '@cocos-challenge/core';
import { createRoute, z } from '@hono/zod-openapi';
import invariant from 'tiny-invariant';

export const orders = honoApp();

orders.use(cookieAuth);

const orderSchema = z
  .object({
    id: z.number(),
    userId: z.number(),
    instrumentId: z.number(),
    side: z.string(),
    type: z.string(),
    status: z.string(),
    price: z.number().optional(),
    datetime: z.date(),
  })
  .openapi('Order');

const assetRoute = createRoute({
  method: 'post',
  tags: ['Orders'],
  path: '/asset',
  summary: 'Buy or Sell an Asset',
  request: {
    body: {
      required: true,
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
                amountType: z.enum(['CASH', 'UNITS']).default('UNITS'),
                side: z.enum(['BUY', 'SELL']),
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
          schema: orderSchema,
        },
      },
    },
  },
});

orders.openapi(assetRoute, async (c) => {
  const userId = c.get('userId');

  invariant(userId, 'userId is required');

  const body = c.req.valid('json');

  const order = await OrdersService.send({
    ...body,
    userId,
  });

  return c.json(order);
});

const cashRoute = createRoute({
  method: 'post',
  tags: ['Orders'],
  path: '/cash',
  summary: 'Cash In or Cash Out',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            amount: z.number(),
            currency: z.string(),
            side: z.enum(['CASH_IN', 'CASH_OUT']),
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
          schema: orderSchema,
        },
      },
    },
  },
});

orders.openapi(cashRoute, async (c) => {
  const body = c.req.valid('json');

  const userId = c.get('userId');

  invariant(userId, 'userId is required');

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

  return c.json(order);
});
