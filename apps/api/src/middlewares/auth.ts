import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

export const cookieAuth = createMiddleware<{
  Variables: {
    userId: number;
  };
}>(async (c, next) => {
  const userId = getCookie(c, 'userId');

  if (!userId) {
    c.status(401);

    return c.json({
      message: `Unauthorized (Use /auth to authenticate yourself)`,
    });
  }

  console.log(userId);

  c.set('userId', +userId);

  await next();
});
