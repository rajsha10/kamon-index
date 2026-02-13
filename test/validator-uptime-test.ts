import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { IndexerGrpcExplorerApi } from "@injectivelabs/sdk-ts";

const stringify = (obj: unknown): string =>
  JSON.stringify(obj, (_: string, v: unknown) => (typeof v === "bigint" ? v.toString() : v), 2);

const endpoints = getNetworkEndpoints(Network.Mainnet);
const explorerApi = new IndexerGrpcExplorerApi(endpoints.explorer!);

const validatorAddress = "inj...";

async function main() {
  try {
    console.log("Fetching validator uptime...\n");

    const validatorUptime = await explorerApi.fetchValidatorUptime(validatorAddress);

    console.log("=== Raw validatorUptime response ===");
    console.log(stringify(validatorUptime));
  } catch (err: any) {
    console.error("Error:", err.message || err);
  }
}

main();
