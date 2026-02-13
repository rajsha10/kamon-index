import { Request, Response } from "express";
import { fetchWalletActivity } from "../services/injective.service";
import { computeScore } from "../services/scoring.service";
import { generateAttestation } from "../services/attestation.service";

export const getTrustProfile = async (req: Request, res: Response) => {
  try {
    const wallet = req.params.wallet as string;

    const activity = await fetchWalletActivity(wallet);
    const isNinja = activity.isNinja;
    const scoreData = computeScore(activity, isNinja);

    // Derived "Intent" Logic
    let intent = "STABLE";
    if (activity.tradeCount > 50) intent = "HIGH_FREQUENCY_MAKER";
    else if (activity.markets.length > 5) intent = "MARKET_EXPLORER";
    else if (scoreData.botProb > 0.6) intent = "POTENTIAL_BOT_ARBITRAGE";

    const attestationToken = generateAttestation({
      wallet,
      isNinja,
      score: scoreData.value,
      risk: scoreData.risk,
      traits: scoreData.tags,
      intent
    });

    const warnings: string[] = [];
    if (!activity.lastActive) warnings.push("NO_LAST_ACTIVE_TX");
    if (!activity.createdAt) warnings.push("NO_ACCOUNT_AGE_TX");
    if (activity.txCount === 0) warnings.push("NO_TX_FOUND");
    if (!isNinja) warnings.push("N1NJ4_NOT_FOUND");

    res.json({
      wallet,
      attestation: attestationToken,
      verified_ninja: isNinja,
      trust_score: scoreData.value,
      intent: {
        label: intent,
        confidence: 1 - scoreData.botProb
      },
      risk: scoreData.risk,
      tags: scoreData.tags,
      last_active: activity.lastActive,
      debug: {
        inputs: {
          txCount: activity.txCount,
          tradeCount: activity.tradeCount,
          balanceCount: activity.balanceCount,
          stakeCount: activity.stakeCount,
          voteCount: activity.voteCount,
          createdAt: activity.createdAt,
          lastActive: activity.lastActive,
          marketsCount: activity.markets.length,
          isNinja
        },
        computed: {
          trustScore: scoreData.value,
          risk: scoreData.risk,
          botProb: scoreData.botProb,
          intent
        },
        warnings
      }
    });
  } catch (err: any) {
    res.status(500).json({
      error: "TRUST_PROFILE_FAILED",
      message: err?.message || "Unknown error"
    });
  }
};
