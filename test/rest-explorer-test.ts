import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { IndexerRestExplorerApi } from "@injectivelabs/sdk-ts";

const stringify = (obj: unknown): string =>
  JSON.stringify(obj, (_: string, v: unknown) => (typeof v === "bigint" ? v.toString() : v), 2);

const endpoints = getNetworkEndpoints(Network.Mainnet);
const restExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`
);

const account = "inj1h754kd0rhdkcpsg9rqnpuxmwgrppscq5vlh2j6";

async function main() {
  try {
    console.log("Fetching last 10 account transactions via REST...\n");

    const accountTransactions = await restExplorerApi.fetchAccountTransactions({
      account,
      params: {
        account,
        limit: 10,
      },
    } as any);

    console.log("=== Raw response ===");
    console.log(stringify(accountTransactions));

    console.log("\n=== Keys on response ===");
    console.log(Object.keys(accountTransactions));
  } catch (err: any) {
    console.error("Error:", err.message || err);
  }
}

main();
