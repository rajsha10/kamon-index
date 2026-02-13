import { bankApi } from "./client.service";

export const getIdentityMetrics = async (address: string) => {
  const { balances } = await bankApi.fetchBalances(address);
  const isNinja = balances.some(b => b.denom.toLowerCase().includes("n1nj4"));
  
  return {
    isNinja,
    balanceCount: balances.length
  };
};