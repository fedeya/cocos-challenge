import { env } from '@/lib/env';
import { honoApp } from '@/lib/hono';
import { AuthService } from '@cocos-challenge/core';
import { createRoute, z } from '@hono/zod-openapi';
import { setCookie } from 'hono/cookie';

export const auth = honoApp();

const route = createRoute({
  method: 'post',
  path: '/',
  tags: ['Auth'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            userId: z.number().default(1),
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
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});

auth.openapi(route, async (c) => {
  const body = c.req.valid('json');

  const user = await AuthService.getUserById(body.userId);

  if (!user) return c.json({ message: 'Invalid user id' }, { status: 401 });

  setCookie(c, 'userId', body.userId.toString(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'Lax',
    secure: env.NODE_ENV === 'production',
  });

  return c.json({
    message: 'Success',
  });
});
