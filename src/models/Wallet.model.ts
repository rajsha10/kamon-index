import mongoose, { Schema, Document } from "mongoose";
import { RiskLevel } from "../types/trust.types";

export interface IWallet extends Document {
  address: string;
  verified_ninja: boolean;
  trust_score: number;
  risk: RiskLevel;
  bot_probability: number;
  tags: string[];
  last_active: string | null;
  updated_at: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    address: { type: String, required: true, unique: true, index: true },
    verified_ninja: { type: Boolean, default: false },
    trust_score: { type: Number, default: 50 },
    risk: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "MEDIUM" },
    bot_probability: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    last_active: { type: String, default: null },
  },
  { timestamps: { createdAt: false, updatedAt: "updated_at" } }
);

export const Wallet = mongoose.model<IWallet>("Wallet", WalletSchema);
