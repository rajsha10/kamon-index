import { spotApi, derivativesApi, accountApi } from "./client.service";

export const getTradingMetrics = async (address: string) => {
  const subaccounts = await accountApi.fetchSubaccountsList(address);
  const markets = new Set<string>();
  let tradeCount = 0;

  for (const subId of subaccounts) {
    const [spot, deriv] = await Promise.all([
      spotApi.fetchTrades({ subaccountId: subId }).catch(() => ({ trades: [] })),
      derivativesApi.fetchTrades({ subaccountId: subId }).catch(() => ({ trades: [] }))
    ]);

    const allSubTrades = [...(spot.trades || []), ...(deriv.trades || [])];
    tradeCount += allSubTrades.length;
    allSubTrades.forEach(t => markets.add(t.marketId));
  }

  return { tradeCount, markets: Array.from(markets) };
};