import { logger } from 'hono/logger';
import { router } from './routes/router';
import { cors } from 'hono/cors';
import { timing } from 'hono/timing';
import { requestId } from 'hono/request-id';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

export const app = new OpenAPIHono();

// Middlewares
app.use(logger());
app.use(cors());
app.use(timing());
app.use(requestId());

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'Cocos Challenge API',
    version: '1.0.0',
  },
});

app.get('/ui', swaggerUI({ url: '/doc' }));

// Base Routing
app.route('/', router);
