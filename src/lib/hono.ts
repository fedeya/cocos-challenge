import { OpenAPIHono } from '@hono/zod-openapi';

export function honoApp() {
  return new OpenAPIHono({
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
