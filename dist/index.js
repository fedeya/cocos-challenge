"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_node_server = require("@hono/node-server");

// src/config/datasource.ts
var import_reflect_metadata = require("reflect-metadata");
var import_typeorm5 = require("typeorm");

// src/entities/instrument.entity.ts
var import_typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
function _ts_metadata(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata, "_ts_metadata");
var InstrumentEntity = class {
  static {
    __name(this, "InstrumentEntity");
  }
  id;
  ticker;
  name;
  type;
};
_ts_decorate([
  (0, import_typeorm.PrimaryGeneratedColumn)(),
  _ts_metadata("design:type", Number)
], InstrumentEntity.prototype, "id", void 0);
_ts_decorate([
  (0, import_typeorm.Column)(),
  _ts_metadata("design:type", String)
], InstrumentEntity.prototype, "ticker", void 0);
_ts_decorate([
  (0, import_typeorm.Column)(),
  _ts_metadata("design:type", String)
], InstrumentEntity.prototype, "name", void 0);
_ts_decorate([
  (0, import_typeorm.Column)(),
  _ts_metadata("design:type", String)
], InstrumentEntity.prototype, "type", void 0);
InstrumentEntity = _ts_decorate([
  (0, import_typeorm.Entity)("instruments")
], InstrumentEntity);

// src/entities/marketdata.entity.ts
var import_typeorm2 = require("typeorm");
function _ts_decorate2(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate2, "_ts_decorate");
function _ts_metadata2(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata2, "_ts_metadata");
var MarketDataEntity = class {
  static {
    __name(this, "MarketDataEntity");
  }
  id;
  instrument;
  instrumentId;
  high;
  low;
  open;
  close;
  previousClose;
  date;
};
_ts_decorate2([
  (0, import_typeorm2.PrimaryGeneratedColumn)(),
  _ts_metadata2("design:type", Number)
], MarketDataEntity.prototype, "id", void 0);
_ts_decorate2([
  (0, import_typeorm2.ManyToOne)(() => InstrumentEntity),
  (0, import_typeorm2.JoinColumn)({
    name: "instrumentid"
  }),
  _ts_metadata2("design:type", typeof InstrumentEntity === "undefined" ? Object : InstrumentEntity)
], MarketDataEntity.prototype, "instrument", void 0);
_ts_decorate2([
  (0, import_typeorm2.Column)({
    name: "instrumentid"
  }),
  _ts_metadata2("design:type", Number)
], MarketDataEntity.prototype, "instrumentId", void 0);
_ts_decorate2([
  (0, import_typeorm2.Column)("decimal", {
    precision: 10,
    scale: 2
  }),
  _ts_metadata2("design:type", Number)
], MarketDataEntity.prototype, "high", void 0);
_ts_decorate2([
  (0, import_typeorm2.Column)("decimal", {
    precision: 10,
    scale: 2
  }),
  _ts_metadata2("design:type", Number)
], MarketDataEntity.prototype, "low", void 0);
_ts_decorate2([
  (0, import_typeorm2.Column)("decimal", {
    precision: 10,
    scale: 2
  }),
  _ts_metadata2("design:type", Number)
], MarketDataEntity.prototype, "open", void 0);
_ts_decorate2([
  (0, import_typeorm2.Column)("decimal", {
    precision: 10,
    scale: 2
  }),
  _ts_metadata2("design:type", Number)
], MarketDataEntity.prototype, "close", void 0);
_ts_decorate2([
  (0, import_typeorm2.Column)("decimal", {
    precision: 10,
    scale: 2,
    name: "previousclose"
  }),
  _ts_metadata2("design:type", Number)
], MarketDataEntity.prototype, "previousClose", void 0);
_ts_decorate2([
  (0, import_typeorm2.Column)(),
  _ts_metadata2("design:type", typeof Date === "undefined" ? Object : Date)
], MarketDataEntity.prototype, "date", void 0);
MarketDataEntity = _ts_decorate2([
  (0, import_typeorm2.Entity)("marketdata")
], MarketDataEntity);

// src/entities/order.entity.ts
var import_typeorm4 = require("typeorm");

// src/entities/user.entity.ts
var import_typeorm3 = require("typeorm");
function _ts_decorate3(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate3, "_ts_decorate");
function _ts_metadata3(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata3, "_ts_metadata");
var UserEntity = class {
  static {
    __name(this, "UserEntity");
  }
  id;
  email;
  accountNumber;
  orders;
};
_ts_decorate3([
  (0, import_typeorm3.PrimaryGeneratedColumn)(),
  _ts_metadata3("design:type", Number)
], UserEntity.prototype, "id", void 0);
_ts_decorate3([
  (0, import_typeorm3.Column)(),
  _ts_metadata3("design:type", String)
], UserEntity.prototype, "email", void 0);
_ts_decorate3([
  (0, import_typeorm3.Column)({
    name: "accountnumber"
  }),
  _ts_metadata3("design:type", String)
], UserEntity.prototype, "accountNumber", void 0);
_ts_decorate3([
  (0, import_typeorm3.OneToMany)(() => OrderEntity, (order) => order.user),
  _ts_metadata3("design:type", Array)
], UserEntity.prototype, "orders", void 0);
UserEntity = _ts_decorate3([
  (0, import_typeorm3.Entity)("users")
], UserEntity);

// src/entities/order.entity.ts
function _ts_decorate4(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate4, "_ts_decorate");
function _ts_metadata4(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata4, "_ts_metadata");
var OrderEntity = class {
  static {
    __name(this, "OrderEntity");
  }
  id;
  user;
  userId;
  instrument;
  instrumentId;
  side;
  size;
  price;
  type;
  status;
  datetime;
};
_ts_decorate4([
  (0, import_typeorm4.PrimaryGeneratedColumn)(),
  _ts_metadata4("design:type", Number)
], OrderEntity.prototype, "id", void 0);
_ts_decorate4([
  (0, import_typeorm4.ManyToOne)(() => UserEntity, (user) => user.orders),
  (0, import_typeorm4.JoinColumn)({
    name: "userid",
    referencedColumnName: "id"
  }),
  _ts_metadata4("design:type", typeof UserEntity === "undefined" ? Object : UserEntity)
], OrderEntity.prototype, "user", void 0);
_ts_decorate4([
  (0, import_typeorm4.Column)({
    name: "userid"
  }),
  _ts_metadata4("design:type", Number)
], OrderEntity.prototype, "userId", void 0);
_ts_decorate4([
  (0, import_typeorm4.ManyToOne)(() => InstrumentEntity),
  (0, import_typeorm4.JoinColumn)({
    name: "instrumentid"
  }),
  _ts_metadata4("design:type", typeof InstrumentEntity === "undefined" ? Object : InstrumentEntity)
], OrderEntity.prototype, "instrument", void 0);
_ts_decorate4([
  (0, import_typeorm4.Column)({
    name: "instrumentid"
  }),
  _ts_metadata4("design:type", Number)
], OrderEntity.prototype, "instrumentId", void 0);
_ts_decorate4([
  (0, import_typeorm4.Column)(),
  _ts_metadata4("design:type", String)
], OrderEntity.prototype, "side", void 0);
_ts_decorate4([
  (0, import_typeorm4.Column)(),
  _ts_metadata4("design:type", Number)
], OrderEntity.prototype, "size", void 0);
_ts_decorate4([
  (0, import_typeorm4.Column)("decimal", {
    precision: 10,
    scale: 2
  }),
  _ts_metadata4("design:type", Number)
], OrderEntity.prototype, "price", void 0);
_ts_decorate4([
  (0, import_typeorm4.Column)(),
  _ts_metadata4("design:type", String)
], OrderEntity.prototype, "type", void 0);
_ts_decorate4([
  (0, import_typeorm4.Column)(),
  _ts_metadata4("design:type", String)
], OrderEntity.prototype, "status", void 0);
_ts_decorate4([
  (0, import_typeorm4.Column)({
    type: "timestamp",
    default: "now()"
  }),
  _ts_metadata4("design:type", typeof Date === "undefined" ? Object : Date)
], OrderEntity.prototype, "datetime", void 0);
OrderEntity = _ts_decorate4([
  (0, import_typeorm4.Entity)("orders")
], OrderEntity);

// src/config/datasource.ts
var import_process = require("process");
var dataSource = new import_typeorm5.DataSource({
  type: "postgres",
  url: import_process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [
    InstrumentEntity,
    MarketDataEntity,
    OrderEntity,
    UserEntity
  ]
});
var userRepository = dataSource.getRepository(UserEntity);
var orderRepository = dataSource.getRepository(OrderEntity);
var instrumentRepository = dataSource.getRepository(InstrumentEntity);
var marketDataRepository = dataSource.getRepository(MarketDataEntity);

// src/app.ts
var import_hono5 = require("hono");
var import_logger = require("hono/logger");

// src/routes/router.ts
var import_hono4 = require("hono");

// src/services/orders.ts
var orders_exports = {};
__export(orders_exports, {
  OrdersService: () => orders_exports,
  cashIn: () => cashIn,
  cashOut: () => cashOut,
  send: () => send
});
var import_tiny_invariant = __toESM(require("tiny-invariant"));

// src/services/portfolio.ts
var portfolio_exports = {};
__export(portfolio_exports, {
  PortfolioService: () => portfolio_exports,
  retrieve: () => retrieve
});

// src/utils/math.ts
var calculateTransactionsPerformance = /* @__PURE__ */ __name((purchases, sales, currentPrice) => {
  const totalPurchased = purchases.reduce((acc, purchase) => acc + purchase.price * purchase.size, 0);
  const totalUnitsBought = purchases.reduce((acc, purchase) => acc + purchase.size, 0);
  const totalSold = sales.reduce((acc, sale) => acc + sale.price * sale.size, 0);
  const totalUnitsSold = sales.reduce((acc, sale) => acc + sale.size, 0);
  const averagePurchasePrice = totalPurchased / totalUnitsBought;
  const costOfUnitsSold = totalUnitsSold * averagePurchasePrice;
  const realizedGainOrLoss = totalSold - costOfUnitsSold;
  const remainingUnits = totalUnitsBought - totalUnitsSold;
  const costOfRemainingUnits = remainingUnits * averagePurchasePrice;
  const currentValueOfRemainingUnits = remainingUnits * currentPrice;
  const unrealizedGainOrLoss = currentValueOfRemainingUnits - costOfRemainingUnits;
  const totalGainOrLoss = realizedGainOrLoss + unrealizedGainOrLoss;
  const totalGainPercentage = totalGainOrLoss / totalPurchased * 100;
  return {
    totalPurchased,
    totalSold,
    totalUnits: remainingUnits,
    totalValue: currentValueOfRemainingUnits,
    realizedGainOrLoss,
    unrealizedGainOrLoss,
    totalGainOrLoss,
    totalGainPercentage: +totalGainPercentage.toFixed(2)
  };
}, "calculateTransactionsPerformance");

// src/services/portfolio.ts
var import_typeorm6 = require("typeorm");
async function retrieve(userId) {
  const userOrders = await orderRepository.find({
    where: {
      userId
    },
    relations: {
      instrument: true
    }
  });
  const userInstruments = Array.from(new Set(userOrders.map((order) => order.instrumentId)));
  const marketData = await marketDataRepository.createQueryBuilder("marketData").where({
    instrumentId: (0, import_typeorm6.In)(userInstruments)
  }).distinctOn([
    "instrumentId"
  ]).orderBy("instrumentId").addOrderBy("date", "DESC").getMany();
  const data = [];
  userOrders.forEach((order) => {
    const itemIndex = data.findIndex((item) => item.instrumentId === order.instrumentId);
    if (itemIndex === -1) {
      data.push({
        instrumentId: order.instrumentId,
        name: order.instrument.name,
        type: order.instrument.type,
        ticker: order.instrument.ticker,
        orders: [
          {
            type: order.type,
            size: order.size,
            side: order.side,
            status: order.status,
            price: order.price,
            datetime: order.datetime
          }
        ]
      });
      return;
    }
    data[itemIndex].orders.push({
      type: order.type,
      side: order.side,
      size: order.size,
      status: order.status,
      price: order.price,
      datetime: order.datetime
    });
  });
  const positions = data.filter((item) => item.type === "ACCIONES").map((item) => {
    const instrumentMarketData = marketData.find((marketData2) => marketData2.instrumentId === item.instrumentId);
    const purchases = item.orders.filter((order) => order.side === "BUY" && order.status === "FILLED");
    const sales = item.orders.filter((order) => order.side === "SELL" && order.status === "FILLED");
    const { totalGainPercentage, totalUnits, totalValue } = calculateTransactionsPerformance(purchases, sales, instrumentMarketData?.close || 1);
    return {
      name: item.name,
      instrumentId: item.instrumentId,
      ticker: item.ticker,
      totalUnits,
      performancePercentage: totalGainPercentage,
      currentPrice: +(instrumentMarketData?.close || 1),
      totalValue
    };
  });
  const availableCash = data.reduce((acc, item) => {
    if (item.type === "MONEDA") {
      return acc + item.orders.reduce((acc2, order) => {
        if (order.side === "CASH_IN") {
          return acc2 + order.size * order.price;
        }
        return acc2 - order.size * order.price;
      }, 0);
    }
    return acc + item.orders.reduce((acc2, order) => {
      if (order.side === "BUY" && [
        "FILLED",
        "NEW"
      ].includes(order.status)) {
        return acc2 - order.size * order.price;
      }
      if (order.side === "SELL" && order.status === "FILLED") {
        return acc2 + order.size * order.price;
      }
      return acc2;
    }, 0);
  }, 0);
  const totalAccountValue = positions.reduce((acc, position) => {
    return acc + position.totalValue;
  }, 0) + availableCash;
  return {
    totalAccountValue,
    availableCash,
    positions
  };
}
__name(retrieve, "retrieve");

// src/services/orders.ts
var import_ts_pattern = require("ts-pattern");
async function cashIn(payload) {
  const instrument = await instrumentRepository.findOne({
    where: {
      ticker: payload.currency
    }
  });
  (0, import_tiny_invariant.default)(instrument, `Instrument with ticker ${payload.currency} not found`);
  const order = orderRepository.create({
    type: "MARKET",
    side: "CASH_IN",
    price: 1,
    userId: payload.userId,
    instrumentId: instrument.id,
    size: payload.amount,
    datetime: /* @__PURE__ */ new Date(),
    status: "FILLED"
  });
  await orderRepository.save(order);
  return order;
}
__name(cashIn, "cashIn");
async function cashOut(payload) {
  const [portfolio2, instrument] = await Promise.all([
    portfolio_exports.retrieve(payload.userId),
    instrumentRepository.findOne({
      where: {
        ticker: payload.currency
      }
    })
  ]);
  (0, import_tiny_invariant.default)(instrument, `Instrument with ticker ${payload.currency} not found`);
  const order = orderRepository.create({
    type: "MARKET",
    side: "CASH_OUT",
    price: 1,
    userId: payload.userId,
    instrumentId: instrument.id,
    size: payload.amount,
    datetime: /* @__PURE__ */ new Date(),
    status: portfolio2.availableCash >= payload.amount ? "FILLED" : "REJECTED"
  });
  await orderRepository.save(order);
  return order;
}
__name(cashOut, "cashOut");
async function send(payload) {
  const [portfolio2, marketData] = await Promise.all([
    portfolio_exports.retrieve(payload.userId),
    marketDataRepository.createQueryBuilder("marketData").where("marketData.instrumentId = :instrumentId", {
      instrumentId: payload.instrumentId
    }).leftJoinAndSelect("marketData.instrument", "instrument").orderBy("date", "DESC").getOne()
  ]);
  (0, import_tiny_invariant.default)(marketData, "Market data not found");
  const size = Math.floor((0, import_ts_pattern.match)(payload.amountType).with("CASH", () => payload.amount / (payload.type === "MARKET" ? marketData.close : payload.price)).with("UNITS", () => payload.amount).exhaustive());
  const value = payload.type === "MARKET" ? marketData.close * size : payload.price * size;
  const position = portfolio2.positions.find((position2) => position2.instrumentId === payload.instrumentId);
  const canBeProcessed = size > 0 ? payload.side === "BUY" ? portfolio2.availableCash >= value : (position?.totalUnits || 0) >= size : false;
  const order = orderRepository.create({
    type: payload.type,
    size,
    status: canBeProcessed ? payload.type === "MARKET" ? "FILLED" : "NEW" : "REJECTED",
    price: payload.type === "MARKET" ? marketData.close : payload.price,
    instrumentId: payload.instrumentId,
    side: payload.side,
    datetime: /* @__PURE__ */ new Date(),
    userId: payload.userId
  });
  await orderRepository.save(order);
  return order;
}
__name(send, "send");

// src/routes/v1/orders.ts
var import_zod_validator = require("@hono/zod-validator");
var import_hono = require("hono");
var import_zod = require("zod");
var orders = new import_hono.Hono();
orders.post("/asset", (0, import_zod_validator.zValidator)("json", import_zod.z.union([
  import_zod.z.object({
    type: import_zod.z.literal("MARKET")
  }),
  import_zod.z.object({
    type: import_zod.z.literal("LIMIT"),
    price: import_zod.z.number()
  })
]).and(import_zod.z.object({
  amount: import_zod.z.number(),
  amountType: import_zod.z.union([
    import_zod.z.literal("CASH"),
    import_zod.z.literal("UNITS")
  ]).default("UNITS"),
  side: import_zod.z.union([
    import_zod.z.literal("BUY"),
    import_zod.z.literal("SELL")
  ]),
  instrumentId: import_zod.z.number()
}))), async (c) => {
  const userId = 3;
  const body = c.req.valid("json");
  const order = await orders_exports.send({
    ...body,
    userId
  });
  return c.json({
    order
  });
});
orders.post("/cash", (0, import_zod_validator.zValidator)("json", import_zod.z.object({
  amount: import_zod.z.number(),
  currency: import_zod.z.string(),
  side: import_zod.z.union([
    import_zod.z.literal("CASH_IN"),
    import_zod.z.literal("CASH_OUT")
  ])
})), async (c) => {
  const body = c.req.valid("json");
  const userId = 3;
  const order = body.side === "CASH_IN" ? await orders_exports.cashIn({
    userId,
    amount: body.amount,
    currency: body.currency
  }) : await orders_exports.cashOut({
    userId,
    amount: body.amount,
    currency: body.currency
  });
  return c.json({
    order
  });
});

// src/routes/v1/portfolio.ts
var import_hono2 = require("hono");
var portfolio = new import_hono2.Hono();
portfolio.get("/", async (c) => {
  const userId = 3;
  const data = await portfolio_exports.retrieve(userId);
  return c.json({
    data
  });
});

// src/routes/v1/instruments.ts
var import_hono3 = require("hono");
var import_zod_validator2 = require("@hono/zod-validator");
var import_zod3 = require("zod");

// src/lib/cache.ts
var import_lru_cache = require("lru-cache");
var import_redis = require("redis");

// src/lib/env.ts
var import_zod2 = require("zod");
var envSchema = import_zod2.z.object({
  REDIS_URL: import_zod2.z.string().optional(),
  DATABASE_URL: import_zod2.z.string(),
  PORT: import_zod2.z.number().default(3e3)
});
var env2 = envSchema.parse(process.env);

// src/lib/cache.ts
function createLRUCache() {
  const cache = new import_lru_cache.LRUCache({
    max: 1e3,
    ttl: 1e3 * 60 * 5
  });
  return {
    get: /* @__PURE__ */ __name(async (key) => cache.get(key), "get"),
    set: /* @__PURE__ */ __name(async (key, value, ttl) => {
      cache.set(key, value, {
        ttl
      });
    }, "set"),
    has: /* @__PURE__ */ __name(async (key) => cache.has(key), "has")
  };
}
__name(createLRUCache, "createLRUCache");
var redisClient = (0, import_redis.createClient)({
  url: env2.REDIS_URL
});
async function createRedisCache() {
  await redisClient.connect();
  return {
    get: /* @__PURE__ */ __name(async (key) => {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }, "get"),
    set: /* @__PURE__ */ __name(async (key, value, ttl) => {
      await redisClient.set(key, JSON.stringify(value), {
        EX: ttl / 1e3
      });
    }, "set"),
    has: /* @__PURE__ */ __name(async (key) => {
      const exists = await redisClient.exists(key);
      return exists === 1;
    }, "has")
  };
}
__name(createRedisCache, "createRedisCache");
async function getCache() {
  if (!global.__cache) {
    try {
      global.__cache = await createRedisCache();
    } catch (error) {
      console.error("Failed to create Redis cache", error);
      console.log("Falling back to in-memory cache");
      global.__cache = createLRUCache();
    }
  }
  return global.__cache;
}
__name(getCache, "getCache");

// src/services/instruments.ts
var instruments_exports = {};
__export(instruments_exports, {
  InstrumentsService: () => instruments_exports,
  search: () => search
});
async function search(options) {
  const { query, limit, filter, page } = options;
  const skip = page * limit;
  const builder = instrumentRepository.createQueryBuilder("instrument");
  filter.forEach((f) => {
    builder.orWhere(`LOWER(instrument.${f}) LIKE :q`, {
      q: `%${query.toLowerCase()}%`
    });
  });
  builder.take(limit).skip(skip);
  builder.useTransaction(true);
  const [data, total] = await builder.getManyAndCount();
  const hasMore = total > limit + skip;
  return {
    data,
    info: {
      total,
      limit,
      page,
      nextPage: hasMore ? page + 1 : null,
      hasMore
    }
  };
}
__name(search, "search");

// src/routes/v1/instruments.ts
var instruments = new import_hono3.Hono();
instruments.get("/search", (0, import_zod_validator2.zValidator)("query", import_zod3.z.object({
  q: import_zod3.z.string().min(1),
  limit: import_zod3.z.coerce.number().optional().default(10),
  page: import_zod3.z.coerce.number().optional().default(0),
  filter: import_zod3.z.enum([
    "name",
    "ticker"
  ]).array().optional().default([
    "name",
    "ticker"
  ]).or(import_zod3.z.enum([
    "name",
    "ticker"
  ]))
})), async (c) => {
  const { limit, page, q, filter } = c.req.valid("query");
  c.header("Cache-Control", "public, max-age=300");
  const filterArray = Array.isArray(filter) ? filter : [
    filter
  ];
  const cacheKey = `${q}-${limit}-${page}-${filterArray.join("-")}`;
  const cache = await getCache();
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    console.log("Cache hit!");
    return c.json(cachedData);
  }
  const res = await instruments_exports.search({
    query: q,
    limit,
    filter: filterArray,
    page
  });
  await cache.set(
    cacheKey,
    res,
    1e3 * 60 * 5
    /* 5 minutes */
  );
  return c.json(res);
});

// src/routes/router.ts
var router = new import_hono4.Hono();
var v1Router = new import_hono4.Hono();
v1Router.route("/orders", orders);
v1Router.route("/portfolio", portfolio);
v1Router.route("/instruments", instruments);
router.route("/v1", v1Router);

// src/app.ts
var import_cors = require("hono/cors");
var import_timing = require("hono/timing");
var import_request_id = require("hono/request-id");
var app = new import_hono5.Hono();
app.use((0, import_logger.logger)());
app.use((0, import_cors.cors)());
app.use((0, import_timing.timing)());
app.use((0, import_request_id.requestId)());
app.route("/", router);

// src/index.ts
async function main() {
  try {
    const { isInitialized } = await dataSource.initialize();
    if (!isInitialized) {
      console.error("Failed to initialize the database connection");
      process.exit(1);
    }
    console.log("Database connection is established");
  } catch (error) {
    console.error("Failed to initialize the database connection", error);
    process.exit(1);
  }
  console.log(`Server is running on port ${env2.PORT}`);
  (0, import_node_server.serve)({
    fetch: app.fetch,
    port: env2.PORT
  });
}
__name(main, "main");
main();
