import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { ChainGrpcBankApi } from "@injectivelabs/sdk-ts";

const stringify = (obj: unknown): string =>
  JSON.stringify(obj, (_: string, v: unknown) => (typeof v === "bigint" ? v.toString() : v), 2);

// Use MainnetSentry to match injective.service.ts
const endpoints = getNetworkEndpoints(Network.MainnetSentry);
const bankApi = new ChainGrpcBankApi(endpoints.grpc);

const injectiveAddress = "inj1h754kd0rhdkcpsg9rqnpuxmwgrppscq5vlh2j6";

async function main() {
  try {
    console.log("Fetching bank balances via ChainGrpcBankApi.fetchBalances()...\n");

    const { balances } = await bankApi.fetchBalances(injectiveAddress);

    console.log("=== All balances ===");
    console.log(stringify(balances));
    console.log(`\nTotal denoms held: ${balances.length}`);

    // N1NJ4 Verified Cyber Identity check — same logic as n1nj4.service.ts
    const isNinja = balances.some((b) => b.denom.toLowerCase().includes("n1nj4"));

    if (isNinja) {
      const n1nj4Balance = balances.find((b) => b.denom.toLowerCase().includes("n1nj4"))!;
      console.log("\n=== N1NJ4 Verified Cyber Identity FOUND ===");
      console.log(`  Denom:  ${n1nj4Balance.denom}`);
      console.log(`  Amount: ${n1nj4Balance.amount}`);
      console.log(`  isNinja: true`);
    } else {
      console.log("\n=== N1NJ4 token NOT found in this wallet ===");
      console.log(`  isNinja: false`);
      console.log("Denoms present:");
      balances.forEach((b) => console.log(`  - ${b.denom}`));
    }
  } catch (err: any) {
    console.error("Error:", err.message || err);
  }
}

main();
