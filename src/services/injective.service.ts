import { 
  IndexerGrpcExplorerApi, 
  IndexerGrpcSpotApi, 
  IndexerGrpcDerivativesApi,
  getEthereumAddress
} from "@injectivelabs/sdk-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { WalletActivity } from "../types/trust.types";

// 1. Setup Endpoints (Mainnet)
const endpoints = getNetworkEndpoints(Network.Testnet);

// 2. Initialize Clients (Using gRPC for everything to ensure consistency)
// We use 'endpoints.indexer' for all of these, reducing configuration errors.
const explorerApi = new IndexerGrpcExplorerApi(endpoints.indexer);
const spotApi = new IndexerGrpcSpotApi(endpoints.indexer);
const derivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer);

export const fetchWalletActivity = async (wallet: string): Promise<WalletActivity> => {
  try {
    // CRITICAL FIX: Convert 'inj1...' address to the default Subaccount ID (Hex)
    // Injective trades are indexed by this Hex ID, not the bech32 address.
    const subaccountId = getEthereumAddress(wallet) + "0".repeat(24);

    /* ---------------- 1. TX HISTORY (gRPC) ---------------- */
    // Fetches transaction history to determine account age and last active time
    const txsResponse = await explorerApi.fetchAccountTx({
      address: wallet,
      limit: 20,
    });
    
    // gRPC returns { txs, pagination }
    const txs = txsResponse.txs || [];

    /* ---------------- 2. TRADING ACTIVITY ---------------- */
    // Fetch Spot and Derivative trades using the CORRECT Subaccount ID
    const [spotTrades, derivTrades] = await Promise.all([
      spotApi.fetchTrades({ subaccountId }).catch(() => ({ trades: [] })),
      derivativesApi.fetchTrades({ subaccountId }).catch(() => ({ trades: [] }))
    ]);

    const allTrades = [
      ...(spotTrades.trades || []),
      ...(derivTrades.trades || [])
    ];

    /* ---------------- 3. ANALYTICS ---------------- */
    const markets = [
      ...new Set(allTrades.map((t: any) => t.marketId))
    ];

    // Safe timestamp extraction (gRPC uses 'blockTimestamp')
    const lastActive = txs.length > 0 ? new Date(txs[0].blockTimestamp).toISOString() : null;
    const createdAt = txs.length > 0 ? new Date(txs[txs.length - 1].blockTimestamp).toISOString() : null;

    return {
      txCount: txs.length,
      tradeCount: allTrades.length,
      lastActive,
      createdAt,
      markets,
      balanceCount: 0,
      stakeCount: 0,
      voteCount: 0,
    };
  } catch (err: any) {
    console.error("SDK Fetch Error:", err.message || err);
    return {
      txCount: 0,
      tradeCount: 0,
      lastActive: null,
      createdAt: null,
      markets: [],
      balanceCount: 0,
      stakeCount: 0,
      voteCount: 0,
    };
  }
};