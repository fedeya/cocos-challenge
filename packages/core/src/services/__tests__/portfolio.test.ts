import {
  getMarketDataRepository,
  getOrderRepository,
} from '@cocos-challenge/db';
import { OrdersService } from '../orders';
import { PortfolioService } from '../portfolio';

describe('Portfolio Service', () => {
  test('should return the correct available cash', async () => {
    const userId = 2;

    let portfolio = await PortfolioService.retrieve(userId);

    await OrdersService.cashIn({
      userId,
      amount: 100,
      currency: 'ARS',
    });

    portfolio = await PortfolioService.retrieve(userId);

    expect(portfolio.availableCash).toBe(100);

    await OrdersService.cashOut({
      userId,
      amount: 50,
      currency: 'ARS',
    });

    portfolio = await PortfolioService.retrieve(userId);

    expect(portfolio.availableCash).toBe(50);

    await OrdersService.cashOut({
      userId,
      amount: 100,
      currency: 'ARS',
    });

    portfolio = await PortfolioService.retrieve(userId);

    expect(portfolio.availableCash).toBe(50);

    await OrdersService.cashIn({
      userId,
      amount: 9950,
      currency: 'ARS',
    });

    portfolio = await PortfolioService.retrieve(userId);

    expect(portfolio.availableCash).toBe(10000);
  });

  test('should return the correct positions', async () => {
    const userId = 2;

    await OrdersService.send({
      userId,
      instrumentId: 30, // closes in 7
      amount: 10,
      side: 'BUY',
      type: 'MARKET',
      amountType: 'UNITS',
    });

    let portfolio = await PortfolioService.retrieve(userId);

    const getPosition = (id: number) =>
      portfolio.positions.find((position) => position.instrumentId === id);

    expect(portfolio.positions).toHaveLength(1);

    expect(getPosition(30)?.totalUnits).toBe(10);

    await OrdersService.send({
      userId,
      instrumentId: 30,
      amount: 5,
      side: 'BUY',
      type: 'MARKET',
      amountType: 'UNITS',
    });

    portfolio = await PortfolioService.retrieve(userId);

    expect(getPosition(30)?.totalUnits).toBe(15);

    await OrdersService.send({
      userId,
      instrumentId: 30,
      amount: 5,
      side: 'SELL',
      type: 'MARKET',
      amountType: 'UNITS',
    });

    portfolio = await PortfolioService.retrieve(userId);

    expect(getPosition(30)?.totalUnits).toBe(10);

    await OrdersService.send({
      userId,
      instrumentId: 30,
      amount: 10,
      side: 'SELL',
      type: 'MARKET',
      amountType: 'UNITS',
    });

    portfolio = await PortfolioService.retrieve(userId);

    expect(portfolio.positions).toHaveLength(0);
    expect(getPosition(30)).toBeUndefined();
  });

  test('should return the correct total account value and performance', async () => {
    const userId = 2;

    await getOrderRepository().delete({
      userId,
    });

    await OrdersService.cashIn({
      userId,
      amount: 10000,
      currency: 'ARS',
    });

    let portfolio = await PortfolioService.retrieve(2);

    expect(portfolio.totalAccountValue).toBe(10000);

    await OrdersService.send({
      userId,
      instrumentId: 30,
      amount: 10,
      side: 'BUY',
      type: 'MARKET',
      amountType: 'UNITS',
    });

    expect(portfolio.totalAccountValue).toBe(10000);

    const marketData = getMarketDataRepository().create({
      instrumentId: 30,
      date: new Date(),
      close: 10,
      open: 7,
      previousClose: 7,
      high: 10.5,
      low: 6.2,
    });

    await getMarketDataRepository().save(marketData);

    portfolio = await PortfolioService.retrieve(userId);

    const position = portfolio.positions.find(
      (position) => position.instrumentId === 30,
    );

    expect(portfolio.totalAccountValue).toBe(10030);

    expect(position?.performancePercentage).toBe(42.86);
  });
});
