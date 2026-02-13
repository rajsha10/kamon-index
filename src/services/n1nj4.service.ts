import { ChainGrpcBankApi } from "@injectivelabs/sdk-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

// Setup Endpoints
const endpoints = getNetworkEndpoints(Network.Mainnet);
const bankApi = new ChainGrpcBankApi(endpoints.grpc);

/**
 * Check if wallet holds an N1NJ4 NFT (or token)
 */
export const checkN1NJ4Holder = async (wallet: string): Promise<boolean> => {
  try {
    // Fetches all balances for the wallet
    const { balances } = await bankApi.fetchBalances(wallet);

    // Look for any coin denom that contains "n1nj4"
    const nftBalance = balances.find((b) => 
      b.denom.toLowerCase().includes("n1nj4")
    );

    // Return true if such a balance exists
    return !!nftBalance;
  } catch (err) {
    console.error("N1NJ4 Check Error:", err);
    return false;
  }
};