import { WalletActivity } from "../types/trust.types";
import { getActivityMetrics } from "./activity.service";
import { getTradingMetrics } from "./trading.service";
import { getIdentityMetrics } from "./identity.service";
import { getStakingMetrics, getGovernanceMetrics } from "./chain.service";

export const fetchWalletActivity = async (wallet: string): Promise<WalletActivity> => {
  const [activityRes, tradingRes, identityRes, stakingRes, governanceRes] =
    await Promise.allSettled([
      getActivityMetrics(wallet),
      getTradingMetrics(wallet),
      getIdentityMetrics(wallet),
      getStakingMetrics(wallet),
      getGovernanceMetrics(wallet),
    ]);

  const activity = activityRes.status === "fulfilled"
    ? activityRes.value
    : (console.error("Activity Error:", (activityRes as PromiseRejectedResult).reason),
       { txCount: 0, lastActive: null, createdAt: null });

  const trading = tradingRes.status === "fulfilled"
    ? tradingRes.value
    : (console.error("Trading Error:", (tradingRes as PromiseRejectedResult).reason),
       { tradeCount: 0, markets: [] as string[] });

  const identity = identityRes.status === "fulfilled"
    ? identityRes.value
    : (console.error("Identity Error:", (identityRes as PromiseRejectedResult).reason),
       { isNinja: false, balanceCount: 0 });

  const staking = stakingRes.status === "fulfilled"
    ? stakingRes.value
    : (console.error("Staking Error:", (stakingRes as PromiseRejectedResult).reason),
       { stakeCount: 0 });

  const governance = governanceRes.status === "fulfilled"
    ? governanceRes.value
    : (console.error("Governance Error:", (governanceRes as PromiseRejectedResult).reason),
       { voteCount: 0 });

  return {
    txCount: activity.txCount,
    tradeCount: trading.tradeCount,
    lastActive: activity.lastActive,
    createdAt: activity.createdAt,
    markets: trading.markets,
    balanceCount: identity.balanceCount,
    stakeCount: staking.stakeCount,
    voteCount: governance.voteCount,
    isNinja: identity.isNinja,
  };
};