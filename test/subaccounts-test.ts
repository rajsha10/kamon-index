import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { IndexerGrpcAccountApi } from "@injectivelabs/sdk-ts";

const stringify = (obj: unknown): string =>
  JSON.stringify(obj, (_: string, v: unknown) => (typeof v === "bigint" ? v.toString() : v), 2);

const endpoints = getNetworkEndpoints(Network.Mainnet);
const accountApi = new IndexerGrpcAccountApi(endpoints.indexer);

const injectiveAddress = "inj1h754kd0rhdkcpsg9rqnpuxmwgrppscq5vlh2j6";

async function main() {
  try {
    console.log("Fetching subaccounts list...\n");

    const subaccountsList = await accountApi.fetchSubaccountsList(injectiveAddress);

    console.log("=== Raw subaccountsList response ===");
    console.log(stringify(subaccountsList));
  } catch (err: any) {
    console.error("Error:", err.message || err);
  }
}

main();
