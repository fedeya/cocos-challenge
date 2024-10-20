import { dataSource } from './data-source';
import { InstrumentEntity } from './entities/instrument.entity';
import { MarketDataEntity } from './entities/marketdata.entity';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from './entities/user.entity';

export const getUserRepository = () => dataSource.getRepository(UserEntity);
export const getOrderRepository = () => dataSource.getRepository(OrderEntity);
export const getInstrumentsRepository = () =>
  dataSource.getRepository(InstrumentEntity);
export const getMarketDataRepository = () =>
  dataSource.getRepository(MarketDataEntity);
