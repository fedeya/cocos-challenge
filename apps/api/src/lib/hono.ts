import { OpenAPIHono } from '@hono/zod-openapi';

interface ContextVariables {
  userId?: number;
}

export function honoApp() {
  return new OpenAPIHono<{ Variables: ContextVariables }>({
    defaultHook: (result, c) => {
      console.log(result);

      if (result.success) {
        return;
      }

      return c.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    },
  });
}
