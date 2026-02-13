import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { IndexerGrpcExplorerApi } from "@injectivelabs/sdk-ts";

const stringify = (obj: unknown): string =>
  JSON.stringify(obj, (_: string, v: unknown) => (typeof v === "bigint" ? v.toString() : v), 2);

const endpoints = getNetworkEndpoints(Network.Mainnet);
const explorerApi = new IndexerGrpcExplorerApi(endpoints.explorer!);

const injectiveAddress = "inj1h754kd0rhdkcpsg9rqnpuxmwgrppscq5vlh2j6"; 

async function main() {
  try {
    console.log("Fetching account transactions...\n");

    const accountTx = await explorerApi.fetchAccountTx({
      address: injectiveAddress,
      limit: 5,
    } as any);

    console.log("=== Raw accountTx response ===");
    console.log(stringify(accountTx));

    console.log("\n=== Keys on response ===");
    console.log(Object.keys(accountTx));

    if (accountTx.txs) {
      console.log(`\nFound ${accountTx.txs.length} txs`);
      if (accountTx.txs.length > 0) {
        console.log("\n=== First tx sample ===");
        console.log(stringify(accountTx.txs[0]));
      }
    }
  } catch (err: any) {
    console.error("Error:", err.message || err);
  }
}

main();
