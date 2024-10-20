import {
  MarketDataEntity,
  OrderEntity,
  getMarketDataRepository,
  getOrderRepository,
} from '@cocos-challenge/db';
import { groupBy } from '../utils/groupBy';
import { calculateTransactionsPerformance } from '../utils/math';
import { In } from 'typeorm';

export async function retrieve(userId: number) {
  const userOrders = await getOrderRepository().find({
    where: {
      userId,
    },
    relations: {
      instrument: true,
    },
  });

  const userInstruments = Array.from(
    new Set(userOrders.map((order) => order.instrumentId)),
  );

  const marketData =
    userInstruments.length > 0 // Only fetch market data if the user has orders
      ? await getMarketDataRepository()
          .createQueryBuilder('marketData')
          .where({
            instrumentId: In(userInstruments),
          })
          .distinctOn(['instrumentId'])
          .orderBy('instrumentId')
          .addOrderBy('date', 'DESC')
          .getMany()
      : [];

  const ordersByInstrument = groupBy(userOrders, (order) => order.instrumentId);

  const marketDataByInstrumentId = groupBy(
    marketData,
    (data) => data.instrumentId,
  );

  const data = Object.entries(ordersByInstrument).map(
    ([instrumentId, orders = []]) => {
      const instrument = orders[0].instrument;
      const { purchases, sales, currentPrice } = processInstrumentOrders(
        orders,
        marketDataByInstrumentId,
      );

      const { totalGainPercentage, totalUnits, totalValue } =
        calculateTransactionsPerformance(purchases, sales, currentPrice);

      return {
        instrumentId: +instrumentId,
        name: instrument.name,
        ticker: instrument.ticker,
        type: instrument.type,
        totalUnits,
        performancePercentage: totalGainPercentage,
        currentPrice,
        totalValue,
      };
    },
  );

  const filteredPositions = data.filter(
    (item) => item.totalUnits > 0 && item.type === 'ACCIONES',
  );

  const availableCash = calculateAvailableCash(userOrders);

  const positionTotalValue = filteredPositions.reduce(
    (acc, position) => acc + position.totalValue,
    0,
  );

  const totalAccountValue = positionTotalValue + availableCash;

  return {
    totalAccountValue,
    availableCash,
    positions: filteredPositions,
  };
}

function calculateAvailableCash(orders: OrderEntity[]) {
  return orders.reduce((acc, order) => {
    // Only consider orders that are NEW or FILLED to calculate the available cash
    if (!['NEW', 'FILLED'].includes(order.status)) return acc;

    // Sell and Cash In increase the available cash
    if (['SELL', 'CASH_IN'].includes(order.side)) {
      return acc + order.size * order.price;
    }

    // Buy and Cash Out reduce the available cash
    if (['BUY', 'CASH_OUT'].includes(order.side)) {
      return acc - order.size * order.price;
    }

    return acc;
  }, 0);
}

function processInstrumentOrders(
  orders: OrderEntity[],
  marketDataByInstrumentId: Record<number, MarketDataEntity[]>,
) {
  const sales: OrderEntity[] = [];
  const purchases: OrderEntity[] = [];

  orders.forEach((order) => {
    if (order.status !== 'FILLED') return;

    if (order.side === 'BUY') {
      purchases.push(order);
    } else if (order.side === 'SELL') {
      sales.push(order);
    }
  });

  const instrumentMarketData =
    marketDataByInstrumentId[orders[0].instrumentId]?.[0] || {};

  const currentPrice = instrumentMarketData.close;

  return {
    purchases,
    sales,
    currentPrice,
  };
}

export * as PortfolioService from './portfolio';
