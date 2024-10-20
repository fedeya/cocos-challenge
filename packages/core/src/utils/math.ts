interface Transaction {
  price: number;
  size: number;
}

export const calculateTransactionsPerformance = (
  purchases: Transaction[],
  sales: Transaction[],
  currentPrice: number,
) => {
  // Paso 1: Calcular el total de unidades compradas y el costo total de las compras
  const totalPurchased = purchases.reduce(
    (acc, purchase) => acc + purchase.price * purchase.size,
    0,
  );
  const totalUnitsBought = purchases.reduce(
    (acc, purchase) => acc + purchase.size,
    0,
  );

  // Paso 2: Calcular las unidades vendidas y los ingresos totales de las ventas
  const totalSold = sales.reduce(
    (acc, sale) => acc + sale.price * sale.size,
    0,
  );
  const totalUnitsSold = sales.reduce((acc, sale) => acc + sale.size, 0);

  // Paso 3: Calcular el costo promedio ponderado de las compras
  const averagePurchasePrice = totalPurchased / totalUnitsBought;

  // Paso 4: Calcular la ganancia/pérdida realizada en las ventas
  const costOfUnitsSold = totalUnitsSold * averagePurchasePrice;
  const realizedGainOrLoss = totalSold - costOfUnitsSold;

  // Paso 5: Calcular el valor de las unidades restantes
  const remainingUnits = totalUnitsBought - totalUnitsSold;
  const costOfRemainingUnits = remainingUnits * averagePurchasePrice;
  const currentValueOfRemainingUnits = remainingUnits * currentPrice;

  // Paso 6: Calcular la ganancia/pérdida no realizada de las unidades restantes
  const unrealizedGainOrLoss =
    currentValueOfRemainingUnits - costOfRemainingUnits;

  // Paso 7: Calcular el rendimiento total
  const totalGainOrLoss = realizedGainOrLoss + unrealizedGainOrLoss;
  const totalGainPercentage = (totalGainOrLoss / totalPurchased) * 100;

  return {
    totalPurchased,
    totalSold,
    totalUnits: remainingUnits,
    totalValue: currentValueOfRemainingUnits,
    realizedGainOrLoss,
    unrealizedGainOrLoss,
    totalGainOrLoss,
    totalGainPercentage: +totalGainPercentage.toFixed(2),
  };
};
