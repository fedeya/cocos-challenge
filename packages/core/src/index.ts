import { initializeDB } from '@cocos-challenge/db';

export { OrdersService } from './services/orders';
export { PortfolioService } from './services/portfolio';
export { InstrumentsService } from './services/instruments';

interface CoreConfig {
  databaseUrl: string;
}

export async function initializeCore(config: CoreConfig) {
  await initializeDB({
    mode: 'dev',
    url: config.databaseUrl,
  });
}
