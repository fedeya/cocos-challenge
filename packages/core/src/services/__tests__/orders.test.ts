import { OrdersService } from '../orders';
import { PortfolioService } from '../portfolio';

describe('Orders Service', () => {
  test('should can cash in', async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(0);

    const result = await OrdersService.cashIn({
      amount: 100,
      currency: 'ARS',
      userId,
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(result.status).toBe('FILLED');
    expect(userPorfolio.availableCash).toBe(100);
  });

  test('should can cash out', async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(100);

    const result = await OrdersService.cashOut({
      amount: 50,
      currency: 'ARS',
      userId,
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(result.status).toBe('FILLED');
    expect(userPorfolio.availableCash).toBe(50);
  });

  test("should can't cash out more than available", async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50);

    const result = await OrdersService.cashOut({
      amount: 100,
      currency: 'ARS',
      userId,
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(result.status).toBe('REJECTED');
    expect(userPorfolio.availableCash).toBe(50);
  });

  test('should can send market buy order by units', async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50);

    const result = await OrdersService.send({
      userId,
      amount: 4,
      side: 'BUY',
      type: 'MARKET',
      amountType: 'UNITS',
      instrumentId: 30, // the 30 close price is 7
    });

    const value = 4 * 7;

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50 - value);

    const position = userPorfolio.positions.find((p) => p.instrumentId === 30);

    expect(result.status).toBe('FILLED');
    expect(position).toBeDefined();
    expect(position?.totalUnits).toBe(4);
  });

  test('should can send market sell order by units', async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(22);

    const result = await OrdersService.send({
      userId,
      amount: 4,
      side: 'SELL',
      type: 'MARKET',
      amountType: 'UNITS',
      instrumentId: 30, // the 30 close price is 7
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50);

    const position = userPorfolio.positions.find((p) => p.instrumentId === 30);

    expect(result.status).toBe('FILLED');
    expect(position).toBeUndefined();
  });

  test('should can send market buy order by cash', async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50);

    const result = await OrdersService.send({
      userId,
      amount: 50,
      side: 'BUY',
      type: 'MARKET',
      amountType: 'CASH',
      instrumentId: 30, // the 30 close price is 7
    });

    const quantity = Math.floor(50 / 7);

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50 - quantity * 7);

    const position = userPorfolio.positions.find((p) => p.instrumentId === 30);

    expect(position).toBeDefined();
    expect(result.status).toBe('FILLED');
    expect(position?.totalUnits).toBe(quantity);
  });

  test('should can send market sell order by cash', async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(1);

    const result = await OrdersService.send({
      userId,
      amount: 49,
      side: 'SELL',
      type: 'MARKET',
      amountType: 'CASH',
      instrumentId: 30, // the 30 close price is 7
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50);

    const position = userPorfolio.positions.find((p) => p.instrumentId === 30);

    expect(result.status).toBe('FILLED');
    expect(position).toBeUndefined();
  });

  test("should can't send market buy order by units more than available cash", async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50);

    const result = await OrdersService.send({
      userId,
      amount: 10,
      side: 'BUY',
      type: 'MARKET',
      amountType: 'UNITS',
      instrumentId: 30, // the 30 close price is 7
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    const position = userPorfolio.positions.find((p) => p.instrumentId === 30);

    expect(result.status).toBe('REJECTED');
    expect(userPorfolio.availableCash).toBe(50);
    expect(position).toBeUndefined();
  });

  test("should can't send market sell order by units more than available units", async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50);

    const result = await OrdersService.send({
      userId,
      amount: 50,
      side: 'SELL',
      type: 'MARKET',
      amountType: 'UNITS',
      instrumentId: 30, // the 30 close price is 7
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(result.status).toBe('REJECTED');
    expect(userPorfolio.availableCash).toBe(50);
  });

  test("should can't send market buy order by cash more than available cash", async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50);

    const result = await OrdersService.send({
      userId,
      amount: 100,
      side: 'BUY',
      type: 'MARKET',
      amountType: 'CASH',
      instrumentId: 30, // the 30 close price is 7
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    const position = userPorfolio.positions.find((p) => p.instrumentId === 30);

    expect(result.status).toBe('REJECTED');
    expect(userPorfolio.availableCash).toBe(50);
    expect(position).toBeUndefined();
  });

  test("should can't send market sell order by cash more than available units", async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50);

    const result = await OrdersService.send({
      userId,
      amount: 100,
      side: 'SELL',
      type: 'MARKET',
      amountType: 'CASH',
      instrumentId: 30, // the 30 close price is 7
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(result.status).toBe('REJECTED');
    expect(userPorfolio.availableCash).toBe(50);
  });

  test('should can send limit buy order by units', async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(50);

    const result = await OrdersService.send({
      userId,
      amount: 4,
      price: 6,
      side: 'BUY',
      type: 'LIMIT',
      amountType: 'UNITS',
      instrumentId: 30, // the 30 close price is 7
    });

    const value = 4 * 6;

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(result.status).toBe('NEW');
    expect(userPorfolio.availableCash).toBe(50 - value);
  });

  test("should can't send limit buy order by units more than available units", async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(26);

    const result = await OrdersService.send({
      userId,
      amount: 4,
      price: 6,
      side: 'SELL',
      type: 'LIMIT',
      amountType: 'UNITS',
      instrumentId: 30, // the 30 close price is 7
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(26);

    const position = userPorfolio.positions.find((p) => p.instrumentId === 30);

    expect(result.status).toBe('REJECTED');
    expect(position).toBeUndefined();
  });

  test('should can send buy limit order by cash', async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(26);

    const result = await OrdersService.send({
      userId,
      amount: 12,
      price: 6,
      side: 'BUY',
      type: 'LIMIT',
      amountType: 'CASH',
      instrumentId: 30, // the 30 close price is 7
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(result.status).toBe('NEW');
    expect(userPorfolio.availableCash).toBe(26 - 12);
  });

  test("should can't send order with amount 0", async () => {
    const userId = 3;

    const result = await OrdersService.send({
      userId,
      amount: 0,
      price: 6,
      side: 'BUY',
      type: 'LIMIT',
      amountType: 'CASH',
      instrumentId: 30, // the 30 close price is 7
    });

    expect(result.status).toBe('REJECTED');
  });

  test('should can cancel a limit order', async () => {
    const userId = 3;

    let userPorfolio = await PortfolioService.retrieve(userId);

    expect(userPorfolio.availableCash).toBe(14);

    const result = await OrdersService.send({
      userId,
      amount: 4,
      price: 2,
      side: 'BUY',
      type: 'LIMIT',
      amountType: 'UNITS',
      instrumentId: 30, // the 30 close price is 7
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(result.status).toBe('NEW');
    expect(userPorfolio.availableCash).toBe(6);

    const cancelResult = await OrdersService.cancel({
      userId,
      orderId: result.id,
    });

    userPorfolio = await PortfolioService.retrieve(userId);

    expect(cancelResult.status).toBe('CANCELLED');
    expect(userPorfolio.availableCash).toBe(14);
  });
});
