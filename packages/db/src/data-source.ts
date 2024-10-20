import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { InstrumentEntity } from './entities/instrument.entity';
import { MarketDataEntity } from './entities/marketdata.entity';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from './entities/user.entity';

const entities = [InstrumentEntity, MarketDataEntity, OrderEntity, UserEntity];

type DBConfig =
  | {
      mode: 'test';
    }
  | {
      mode: 'dev';
      url: string;
    };

export let dataSource: DataSource;

export function initializeDB(config: DBConfig) {
  const testOptions: DataSourceOptions = {
    type: 'better-sqlite3',
    database: ':memory:',
    entities,
    synchronize: true,
  };

  const devOptions: DataSourceOptions = {
    type: 'postgres',
    url: config.mode === 'dev' ? config.url : undefined,
    entities,
    synchronize: false,
    logging: true,
  };

  dataSource = new DataSource(
    config.mode === 'test' ? testOptions : devOptions,
  );

  return dataSource.initialize();
}
