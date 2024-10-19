import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { InstrumentEntity } from '../entities/instrument.entity';
import { MarketDataEntity } from '../entities/marketdata.entity';
import { OrderEntity } from '../entities/order.entity';
import { UserEntity } from '../entities/user.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,

  entities: [InstrumentEntity, MarketDataEntity, OrderEntity, UserEntity],
});

export const userRepository = dataSource.getRepository(UserEntity);
export const orderRepository = dataSource.getRepository(OrderEntity);
export const instrumentRepository = dataSource.getRepository(InstrumentEntity);
export const marketDataRepository = dataSource.getRepository(MarketDataEntity);
