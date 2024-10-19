import { marketDataRepository, orderRepository } from '@/config/datasource';
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

  const data: Array<{
    instrumentId: number;
    name: string;
    type: 'MONEDA' | 'ACCIONES';
    ticker: string;
    orders: Array<{
      type: string;
      size: number;
      side: string;
      status: string;
      price: number;
      datetime?: Date;
    }>;
  }> = [];

  userOrders.forEach((order) => {
    const itemIndex = data.findIndex(
      (item) => item.instrumentId === order.instrumentId,
    );

    if (itemIndex === -1) {
      data.push({
        instrumentId: order.instrumentId,
        name: order.instrument.name,
        type: order.instrument.type as any,
        ticker: order.instrument.ticker,
        orders: [
          {
            type: order.type,
            size: order.size,
            side: order.side,
            status: order.status,
            price: order.price,
            datetime: order.datetime,
          },
        ],
      });

      return;
    }

    data[itemIndex].orders.push({
      type: order.type,
      side: order.side,
      size: order.size,
      status: order.status,
      price: order.price,
      datetime: order.datetime,
    });
  });

  const positions = data
    .filter((item) => item.type === 'ACCIONES')
    .map((item) => {
      const instrumentMarketData = marketData.find(
        (marketData) => marketData.instrumentId === item.instrumentId,
      );

      const purchases = item.orders.filter(
        (order) => order.side === 'BUY' && order.status === 'FILLED',
      );

      const sales = item.orders.filter(
        (order) => order.side === 'SELL' && order.status === 'FILLED',
      );

      const { totalGainPercentage, totalUnits, totalValue } =
        calculateTransactionsPerformance(
          purchases,
          sales,
          instrumentMarketData?.close || 1,
        );

      return {
        name: item.name,
        instrumentId: item.instrumentId,
        ticker: item.ticker,
        totalUnits,
        performancePercentage: totalGainPercentage,
        currentPrice: +(instrumentMarketData?.close || 1),
        totalValue,
        // orders: item.orders.concat().sort((a, b) => {
        //   if (a.datetime && b.datetime) {
        //     return a.datetime.getTime() - b.datetime.getTime();
        //   }
        //
        //   return 0;
        // }),
      };
    });

  const availableCash = data.reduce((acc, item) => {
    if (item.type === 'MONEDA') {
      return (
        acc +
        item.orders.reduce((acc, order) => {
          if (order.side === 'CASH_IN') {
            return acc + order.size * order.price;
          }

          return acc - order.size * order.price;
        }, 0)
      );
    }

    return (
      acc +
      item.orders.reduce((acc, order) => {
        if (order.side === 'BUY' && ['FILLED', 'NEW'].includes(order.status)) {
          return acc - order.size * order.price;
        }

        if (order.side === 'SELL' && order.status === 'FILLED') {
          return acc + order.size * order.price;
        }

        return acc;
      }, 0)
    );
  }, 0);

  const totalAccountValue =
    positions.reduce((acc, position) => {
      return acc + position.totalValue;
    }, 0) + availableCash;

  return {
    totalAccountValue,
    availableCash,
    positions,
  };
}

export * as PortfolioService from './portfolio';
