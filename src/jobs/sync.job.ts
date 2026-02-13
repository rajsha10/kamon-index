import cron from "node-cron";
import { Wallet } from "../models/Wallet.model";
import { fetchWalletActivity } from "../services/injective.service";
import { checkN1NJ4Holder } from "../services/n1nj4.service";
import { computeScore } from "../services/scoring.service";

export const startSyncJob = (): void => {
  cron.schedule("*/30 * * * *", async () => {
    console.log("[sync] Starting wallet sync...");
    try {
      const wallets = await Wallet.find({});
      for (const w of wallets) {
        const activity = await fetchWalletActivity(w.address);
        const isNinja = await checkN1NJ4Holder(w.address);
        const score = computeScore(activity, isNinja);

        await Wallet.updateOne(
          { address: w.address },
          {
            trust_score: score.value,
            risk: score.risk,
            bot_probability: score.botProb,
            tags: score.tags,
            verified_ninja: isNinja,
            last_active: activity.lastActive,
          }
        );
      }
      console.log(`[sync] Synced ${wallets.length} wallets`);
    } catch (err) {
      console.error("[sync] Error:", err);
    }
  });
};
