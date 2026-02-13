import {
  WalletActivity,
  RiskLevel
} from "../types/trust.types";

export const computeScore = (
  activity: WalletActivity,
  isNinja: boolean
) => {
  let score = 0;

  // Indentity 
  if (isNinja) score += 10;

  // Activity 
  score += Math.min(activity.txCount / 5, 20);

  //Economic Stake
  score += Math.min(activity.balanceCount * 5, 15);

  //Commitment
  if (activity.stakeCount > 0) score += 15;

  //Governance
  if (activity.voteCount > 0) score += 10;

  //Age
  if (activity.createdAt) {
    const ageDays =
      (Date.now() -
        new Date(activity.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (ageDays > 180) score += 10;
    if (ageDays > 365) score += 15;
  }

  let botProb = 0.4;

  if (activity.txCount > 20) botProb -= 0.1;
  if (activity.stakeCount > 0) botProb -= 0.1;
  if (activity.balanceCount > 2) botProb -= 0.1;
  if (isNinja) botProb -= 0.1;

  botProb = Math.max(0, Number(botProb.toFixed(2)));

  let risk: RiskLevel = "MEDIUM";

  if (score > 65) risk = "LOW";
  if (score < 35) risk = "HIGH";

  return {
    value: Math.min(100, score),
    risk,
    botProb,
    tags: [
      isNinja ? "N1NJ4_VERIFIED" : "UNVERIFIED",
      activity.stakeCount > 0
        ? "STAKER"
        : "NON_STAKER",
      activity.txCount > 20
        ? "ACTIVE"
        : "LOW_ACTIVITY"
    ]
  };
};
