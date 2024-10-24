import {
  getInstrumentsRepository,
  getMarketDataRepository,
  getOrderRepository,
} from '@cocos-challenge/db';
import invariant from 'tiny-invariant';
import { PortfolioService } from './portfolio';
import { match } from 'ts-pattern';

interface CashOperationPayload {
  userId: number;
  amount: number;
  currency: string;
}

export async function cashIn(payload: CashOperationPayload) {
  const instrument = await getInstrumentsRepository().findOne({
    where: { ticker: payload.currency, type: 'MONEDA' },
  });

  invariant(instrument, `Instrument with ticker ${payload.currency} not found`);

  const orderRepository = getOrderRepository();

  const order = orderRepository.create({
    type: 'MARKET',
    side: 'CASH_IN',
    price: 1,
    userId: payload.userId,
    instrumentId: instrument.id,
    size: payload.amount,
    datetime: new Date(),
    status: 'FILLED',
  });

  await orderRepository.save(order);

  return order;
}

export async function cashOut(payload: CashOperationPayload) {
  const [portfolio, instrument] = await Promise.all([
    PortfolioService.retrieve(payload.userId),
    getInstrumentsRepository().findOne({
      where: { ticker: payload.currency, type: 'MONEDA' },
    }),
  ]);

  invariant(instrument, `Instrument with ticker ${payload.currency} not found`);

  const orderRepository = getOrderRepository();

  const order = orderRepository.create({
    type: 'MARKET',
    side: 'CASH_OUT',
    price: 1,
    userId: payload.userId,
    instrumentId: instrument.id,
    size: payload.amount,
    datetime: new Date(),
    status: portfolio.availableCash >= payload.amount ? 'FILLED' : 'REJECTED',
  });

  await orderRepository.save(order);

  return order;
}

type SendOrderPayload = {
  userId: number;
  instrumentId: number;
  amount: number;
  amountType: 'CASH' | 'UNITS';
  side: 'BUY' | 'SELL';
} & (
  | {
      type: 'MARKET';
    }
  | {
      type: 'LIMIT';
      price: number;
    }
);

export async function send(payload: SendOrderPayload) {
  const [portfolio, marketData] = await Promise.all([
    PortfolioService.retrieve(payload.userId),
    getMarketDataRepository()
      .createQueryBuilder('marketData')
      .where('marketData.instrumentId = :instrumentId', {
        instrumentId: payload.instrumentId,
      })
      .leftJoinAndSelect('marketData.instrument', 'instrument')
      .orderBy('date', 'DESC')
      .getOne(),
  ]);

  invariant(marketData, 'Market data not found');

  const size = Math.floor(
    match(payload.amountType)
      .with(
        'CASH',
        () =>
          payload.amount /
          (payload.type === 'MARKET' ? marketData.close : payload.price),
      )
      .with('UNITS', () => payload.amount)
      .exhaustive(),
  );

  const value =
    payload.type === 'MARKET' ? marketData.close * size : payload.price * size;

  const position = portfolio.positions.find(
    (position) => position.instrumentId === payload.instrumentId,
  );

  const canBeProcessed =
    size > 0
      ? payload.side === 'BUY'
        ? portfolio.availableCash >= value
        : (position?.totalUnits || 0) >= size
      : false;

  const orderRepository = getOrderRepository();

  const order = orderRepository.create({
    type: payload.type,
    size,
    status: canBeProcessed
      ? payload.type === 'MARKET'
        ? 'FILLED'
        : 'NEW'
      : 'REJECTED',
    price: payload.type === 'MARKET' ? marketData.close : payload.price,
    instrumentId: payload.instrumentId,
    side: payload.side,
    datetime: new Date(),
    userId: payload.userId,
  });

  await orderRepository.save(order);

  return order;
}

interface CancelOrderPayload {
  userId: number;
  orderId: number;
}

export async function cancel(payload: CancelOrderPayload) {
  const orderRepository = getOrderRepository();

  const order = await orderRepository.findOne({
    where: {
      id: payload.orderId,
      userId: payload.userId,
      type: 'LIMIT',
      status: 'NEW',
    },
  });

  invariant(order, 'Order not found');

  order.status = 'CANCELLED';

  await orderRepository.save(order);

  return order;
}

export * as OrdersService from './orders';
