import { Request, Response } from "express";
import { fetchWalletActivity } from "../services/injective.service";
import { checkN1NJ4Holder } from "../services/n1nj4.service";
import { computeScore } from "../services/scoring.service";
import { generateAttestation } from "../services/attestation.service";

export const getTrustProfile = async (req: Request, res: Response) => {
  const wallet = req.params.wallet as string;

  const activity = await fetchWalletActivity(wallet);
  const isNinja = await checkN1NJ4Holder(wallet);
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
    last_active: activity.lastActive
  });
};