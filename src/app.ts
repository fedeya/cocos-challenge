import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { router } from './routes/router';
import { cors } from 'hono/cors';
import { timing } from 'hono/timing';
import { requestId } from 'hono/request-id';

export const app = new Hono();

// Middlewares
app.use(logger());
app.use(cors());
app.use(timing());
app.use(requestId());

// Base Routing
app.route('/', router);
