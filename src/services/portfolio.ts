import { marketDataRepository, orderRepository } from '@/config/datasource';
import { OrderEntity } from '@/entities/order.entity';
import { groupBy } from '@/utils/groupBy';
import { calculateTransactionsPerformance } from '@/utils/math';
import { In } from 'typeorm';

export async function retrieve(userId: number) {
  const userOrders = await orderRepository.find({
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

  const marketData = await marketDataRepository
    .createQueryBuilder('marketData')
    .where({
      instrumentId: In(userInstruments),
    })
    .distinctOn(['instrumentId'])
    .orderBy('instrumentId')
    .addOrderBy('date', 'DESC')
    .getMany();

  const ordersByInstrument = groupBy(userOrders, (order) => order.instrumentId);

  const data = Object.entries(ordersByInstrument).map(
    ([instrumentId, orders = []]) => {
      const instrument = orders![0].instrument;

      return {
        instrumentId: +instrumentId,
        ...instrument,
        orders,
      };
    },
  );

  let positionTotalValue = 0;

  const marketDataByInstrumentId = groupBy(
    marketData,
    (data) => data.instrumentId,
  );

  const positions = data
    .filter((item) => item.type === 'ACCIONES')
    .map((item) => {
      const instrumentMarketData =
        marketDataByInstrumentId[item.instrumentId][0];

      const sales: OrderEntity[] = [];
      const purchases: OrderEntity[] = [];

      item.orders.forEach((order) => {
        if (order.side === 'BUY' && order.status === 'FILLED') {
          purchases.push(order);
        }

        if (order.side === 'SELL' && order.status === 'FILLED') {
          sales.push(order);
        }
      });

      const { totalGainPercentage, totalUnits, totalValue } =
        calculateTransactionsPerformance(
          purchases,
          sales,
          instrumentMarketData?.close || 1,
        );

      positionTotalValue += totalValue;

      return {
        name: item.name,
        instrumentId: item.instrumentId,
        ticker: item.ticker,
        totalUnits,
        performancePercentage: totalGainPercentage,
        currentPrice: +(instrumentMarketData?.close || 1),
        totalValue,
      };
    });

  const availableCash = userOrders.reduce((acc, order) => {
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

  const totalAccountValue = positionTotalValue + availableCash;

  return {
    totalAccountValue,
    availableCash,
    positions: positions.filter((position) => position.totalUnits > 0),
  };
}

export * as PortfolioService from './portfolio';
