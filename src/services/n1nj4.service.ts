import { bankApi } from "./client.service";

export const checkN1NJ4Holder = async (wallet: string): Promise<boolean> => {
  try {
    const { balances } = await bankApi.fetchBalances(wallet);
    return balances.some((b) => b.denom.toLowerCase().includes("n1nj4"));
  } catch (err) {
    console.error("N1NJ4 Check Error:", err);
    return false;
  }
};
