export interface WalletActivity {
  txCount: number;
  tradeCount: number;
  lastActive: string | null;
  createdAt: string | null;
  markets: string[];

  balanceCount: number;
  stakeCount: number;
  voteCount: number;
  isNinja: boolean;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
