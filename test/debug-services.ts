import { getActivityMetrics } from "../src/services/activity.service";
import { getTradingMetrics } from "../src/services/trading.service";
import { getIdentityMetrics } from "../src/services/identity.service";
import { getStakingMetrics, getGovernanceMetrics } from "../src/services/chain.service";

const wallet = "inj1h754kd0rhdkcpsg9rqnpuxmwgrppscq5vlh2j6";

async function main() {
  console.log("=== Testing each service individually ===\n");

  console.log("1. Activity Metrics...");
  try {
    const a = await getActivityMetrics(wallet);
    console.log("   OK:", JSON.stringify(a, null, 2));
  } catch (e: any) {
    console.error("   FAILED:", e.message);
  }

  console.log("\n2. Identity Metrics...");
  try {
    const i = await getIdentityMetrics(wallet);
    console.log("   OK:", JSON.stringify(i, null, 2));
  } catch (e: any) {
    console.error("   FAILED:", e.message);
  }

  console.log("\n3. Staking Metrics...");
  try {
    const s = await getStakingMetrics(wallet);
    console.log("   OK:", JSON.stringify(s, null, 2));
  } catch (e: any) {
    console.error("   FAILED:", e.message);
  }

  console.log("\n4. Trading Metrics...");
  try {
    const t = await getTradingMetrics(wallet);
    console.log("   OK:", JSON.stringify(t, null, 2));
  } catch (e: any) {
    console.error("   FAILED:", e.message);
  }

  console.log("\n5. Governance Metrics...");
  try {
    const g = await getGovernanceMetrics(wallet);
    console.log("   OK:", JSON.stringify(g, null, 2));
  } catch (e: any) {
    console.error("   FAILED:", e.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FATAL:", e);
    process.exit(1);
  });
