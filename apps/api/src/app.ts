import { logger } from 'hono/logger';
import { router } from './routes/router';
import { cors } from 'hono/cors';
import { timing } from 'hono/timing';
import { requestId } from 'hono/request-id';
import { swaggerUI } from '@hono/swagger-ui';
import { honoApp } from './lib/hono';
import { HTTPException } from 'hono/http-exception';
import { showRoutes } from 'hono/dev';

export const app = honoApp();

// Middlewares
app.use(logger());
app.use(cors());
app.use(timing());
app.use(requestId());

// OpenAPI Docs
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'Cocos Challenge API',
    description: 'API for the Cocos Challenge',
    contact: {
      name: 'Federico Minaya',
      url: 'https://fedeminaya.com',
      email: 'hello@fedeminaya.com',
    },
    version: '1.0.0',
  },
  tags: [
    {
      name: 'Orders',
      description: 'Operations related to Orders',
    },
    {
      name: 'Portfolio',
      description: 'Operations related to Portfolio',
    },
    {
      name: 'Instruments',
      description: 'Operations related to Instruments',
    },
  ],
});

app.openAPIRegistry.registerComponent('securitySchemes', 'cookieAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: 'userId',
});

// Swagger UI
app.get('/api', swaggerUI({ url: '/doc' }));

// Base Routing
app.route('/', router);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const response = err.getResponse();

    return c.json(
      {
        success: false,
        message: err.message,
      },
      { status: response.status },
    );
  }

  return c.json({ message: 'Internal Server Error' }, { status: 500 });
});
