import { orders } from './v1/orders';
import { portfolio } from './v1/portfolio';
import { instruments } from './v1/instruments';
import { OpenAPIHono } from '@hono/zod-openapi';
import { auth } from './v1/auth';

export const router = new OpenAPIHono();

const v1Router = new OpenAPIHono();

// V1 routes

v1Router.route('/orders', orders);
v1Router.route('/portfolio', portfolio);
v1Router.route('/instruments', instruments);
v1Router.route('/auth', auth);

// Base routes
router.route('/v1', v1Router);
