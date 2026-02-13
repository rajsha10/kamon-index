import axios from "axios";
import { explorerApi } from "./client.service";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const endpoints = getNetworkEndpoints(Network.MainnetSentry);

export const getActivityMetrics = async (address: string) => {
  //to get lastActive + total count from pagination
  const recent = await explorerApi.fetchAccountTx({
    address,
    limit: 1,
  });

  const recentTxs = recent.txs || [];
  const totalTxCount = (recent.pagination as any)?.total ?? recentTxs.length;

  //the oldest tx
  let createdAt: string | null = null;
  if (totalTxCount > 1) {
    try {
      const res = await axios.get<{ data?: Array<{ block_timestamp: string }> }>(
        `${endpoints.explorer}/api/explorer/v1/accountTxs/${address}`,
        { params: { limit: 1, skip: totalTxCount - 1 }, timeout: 10000 }
      );
      const oldest = res.data.data;
      if (oldest && oldest.length > 0) {
        createdAt = new Date(oldest[0].block_timestamp).toISOString();
      }
    } catch {
      console.log(`Failed to fetch oldest tx for ${address}, skipping createdAt`);
    }
  }

  return {
    txCount: totalTxCount,
    lastActive: recentTxs.length > 0
      ? new Date(recentTxs[0].blockTimestamp).toISOString()
      : null,
    createdAt,
  };
};