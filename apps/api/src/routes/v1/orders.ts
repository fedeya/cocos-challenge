import { honoApp } from '@/lib/hono';
import { cookieAuth } from '@/middlewares/auth';
import { OrdersService } from '@cocos-challenge/core';
import { createRoute, z } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
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
  security: [{ cookieAuth: [] }],
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
            )
            .openapi('AssetOrderPayload'),
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

  invariant(typeof userId !== 'undefined', 'userId is required');

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
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z
            .object({
              amount: z.number(),
              currency: z.string(),
              side: z.enum(['CASH_IN', 'CASH_OUT']),
            })
            .openapi('CashOrderPayload'),
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

  invariant(typeof userId !== 'undefined', 'userId is required');

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

const cancelRoute = createRoute({
  method: 'patch',
  tags: ['Orders'],
  path: '/cancel',
  summary: 'Cancel an Order',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            orderId: z.number(),
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

orders.openapi(cancelRoute, async (c) => {
  const body = c.req.valid('json');

  const userId = c.get('userId');

  invariant(typeof userId !== 'undefined', 'userId is required');

  try {
    const order = await OrdersService.cancel({
      userId,
      orderId: body.orderId,
    });

    return c.json(order);
  } catch (err) {
    throw new HTTPException(404, { message: 'Order not found' });
  }
});
