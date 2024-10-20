import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { InstrumentEntity } from '../entities/instrument.entity';
import { MarketDataEntity } from '../entities/marketdata.entity';
import { OrderEntity } from '../entities/order.entity';
import { UserEntity } from '../entities/user.entity';
import { env } from '@/lib/env';

const entities = [InstrumentEntity, MarketDataEntity, OrderEntity, UserEntity];

const testOptions: DataSourceOptions = {
  type: 'better-sqlite3',
  database: ':memory:',
  entities,
  synchronize: true,
};

const devOptions: DataSourceOptions = {
  type: 'postgres',
  url: env.DATABASE_URL,
  entities,
  synchronize: false,
  logging: true,
};

export const dataSource = new DataSource(
  env.NODE_ENV === 'test' ? testOptions : devOptions,
);

export const userRepository = dataSource.getRepository(UserEntity);
export const orderRepository = dataSource.getRepository(OrderEntity);
export const instrumentRepository = dataSource.getRepository(InstrumentEntity);
export const marketDataRepository = dataSource.getRepository(MarketDataEntity);
