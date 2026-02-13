import axios from "axios";
import { stakingApi } from "./client.service";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const endpoints = getNetworkEndpoints(Network.MainnetSentry);

export const getStakingMetrics = async (address: string) => {
  try {
    const { delegations } = await stakingApi.fetchDelegations({
      injectiveAddress: address,
    });
    return { stakeCount: delegations.length };
  } catch (err) {
    console.error("Staking Fetch Error:", err);
    return { stakeCount: 0 };
  }
};

export const getGovernanceMetrics = async (address: string) => {
  try {
    // Use LCD REST API to query proposals the wallet voted on
    // This is much more efficient than iterating all proposals
    const res = await axios.get<{ proposals?: unknown[] }>(
      `${endpoints.rest}/cosmos/gov/v1/proposals`,
      { params: { voter: address, "pagination.limit": 100 }, timeout: 10000 }
    );
    const proposals = res.data.proposals || [];
    return { voteCount: proposals.length };
  } catch (err) {
    console.error("Governance Fetch Error:", err);
    return { voteCount: 0 };
  }
};
