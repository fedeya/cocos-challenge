import { OrdersService } from '@/services/orders';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

export const orders = new Hono();

orders.post(
  '/asset',
  zValidator(
    'json',
    z
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
  ),
  async (c) => {
    const userId = 3;

    const body = c.req.valid('json');

    const order = await OrdersService.send({
      ...body,
      userId,
    });

    return c.json({
      order,
    });
  },
);

orders.post(
  '/cash',
  zValidator(
    'json',
    z.object({
      amount: z.number(),
      currency: z.string(),
      side: z.union([z.literal('CASH_IN'), z.literal('CASH_OUT')]),
    }),
  ),
  async (c) => {
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
  },
);
