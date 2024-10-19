import { Hono } from 'hono';
import { PortfolioService } from '@/services/portfolio';

export const portfolio = new Hono();

portfolio.get('/', async (c) => {
  const userId = 3;

  const data = await PortfolioService.retrieve(userId);

  return c.json({
    data,
  });
});
