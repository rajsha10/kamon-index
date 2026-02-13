import { Request, Response } from "express";
import { fetchWalletActivity } from "../services/injective.service";
import { computeScore } from "../services/scoring.service";
import { generateAttestation } from "../services/attestation.service";
import { ENV } from "../config/env";

export const getTrustProfile = async (req: Request, res: Response) => {
  try {
    const wallet = req.params.wallet as string;

    const activity = await fetchWalletActivity(wallet);
    const isNinja = activity.isNinja;
    const scoreData = computeScore(activity, isNinja);

    // Intent Logic
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
      verified_ninja: isNinja,
      trust_score: scoreData.value,
      risk: scoreData.risk,
      bot_probability: scoreData.botProb,
      intent: {
        label: intent,
        confidence: 1 - scoreData.botProb
      },
      tags: scoreData.tags,
      last_active: activity.lastActive,
      attestation: attestationToken,
    });
  } catch (err: any) {
    res.status(500).json({
      error: "TRUST_PROFILE_FAILED",
      message: err?.message || "Unknown error"
    });
  }
};

export const compareTrustProfiles = async (req: Request, res: Response) => {
  try {
    const { walletA, walletB } = req.body;
    if (!walletA || !walletB) {
      res.status(400).json({ error: "MISSING_WALLETS", message: "walletA and walletB are required" });
      return;
    }

    const [actA, actB] = await Promise.all([
      fetchWalletActivity(walletA),
      fetchWalletActivity(walletB),
    ]);

    const scoreA = computeScore(actA, actA.isNinja);
    const scoreB = computeScore(actB, actB.isNinja);

    const reasons: string[] = [];

    if (actA.txCount > actB.txCount * 2 || actB.txCount > actA.txCount * 2)
      reasons.push(actA.txCount > actB.txCount ? "HIGHER_ACTIVITY" : "LOWER_ACTIVITY");

    if (actA.createdAt && actB.createdAt) {
      const ageA = Date.now() - new Date(actA.createdAt).getTime();
      const ageB = Date.now() - new Date(actB.createdAt).getTime();
      if (Math.abs(ageA - ageB) > 30 * 24 * 60 * 60 * 1000)
        reasons.push(ageA > ageB ? "OLDER_ACCOUNT" : "NEWER_ACCOUNT");
    }

    if (actA.isNinja !== actB.isNinja)
      reasons.push(actA.isNinja ? "N1NJ4_HOLDER" : "NO_N1NJ4");

    if (actA.stakeCount > 0 !== (actB.stakeCount > 0))
      reasons.push(actA.stakeCount > 0 ? "STAKER" : "NON_STAKER");

    if (actA.tradeCount > actB.tradeCount * 2 || actB.tradeCount > actA.tradeCount * 2)
      reasons.push(actA.tradeCount > actB.tradeCount ? "MORE_TRADES" : "FEWER_TRADES");

    if (actA.markets.length > actB.markets.length)
      reasons.push("MORE_MARKETS");
    else if (actB.markets.length > actA.markets.length)
      reasons.push("FEWER_MARKETS");

    if (actA.voteCount > 0 !== (actB.voteCount > 0))
      reasons.push(actA.voteCount > 0 ? "GOVERNANCE_VOTER" : "NO_GOVERNANCE");

    if (reasons.length === 0 && scoreA.value !== scoreB.value)
      reasons.push("HIGHER_TRUST_SCORE");

    const winner = scoreA.value >= scoreB.value ? "walletA" : "walletB";

    const winnerReasons = winner === "walletA"
      ? reasons
      : reasons.map(r => {
          const flips: Record<string, string> = {
            LOWER_ACTIVITY: "HIGHER_ACTIVITY", HIGHER_ACTIVITY: "LOWER_ACTIVITY",
            NEWER_ACCOUNT: "OLDER_ACCOUNT", OLDER_ACCOUNT: "NEWER_ACCOUNT",
            NO_N1NJ4: "N1NJ4_HOLDER", N1NJ4_HOLDER: "NO_N1NJ4",
            NON_STAKER: "STAKER", STAKER: "NON_STAKER",
            FEWER_TRADES: "MORE_TRADES", MORE_TRADES: "FEWER_TRADES",
            FEWER_MARKETS: "MORE_MARKETS", MORE_MARKETS: "FEWER_MARKETS",
            NO_GOVERNANCE: "GOVERNANCE_VOTER", GOVERNANCE_VOTER: "NO_GOVERNANCE",
          };
          return flips[r] || r;
        });

    res.json({
      winner,
      reason: winnerReasons,
      scores: {
        A: scoreA.value,
        B: scoreB.value,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      error: "COMPARE_FAILED",
      message: err?.message || "Unknown error"
    });
  }
};

export const getTrustDebug = async (req: Request, res: Response) => {
  if (!ENV.DEBUG_MODE) {
    res.status(403).json({ error: "Debug disabled" });
    return;
  }

  try {
    const wallet = req.params.wallet as string;

    const activity = await fetchWalletActivity(wallet);
    const isNinja = activity.isNinja;
    const score = computeScore(activity, isNinja);

    res.json({
      wallet,
      activity,
      scoring: score,
      raw: {
        isNinja,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      error: "DEBUG_FAILED",
      message: err?.message || "Unknown error",
    });
  }
};
