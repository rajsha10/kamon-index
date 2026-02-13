import jwt from "jsonwebtoken";
import { RiskLevel } from "../types/trust.types";

const SECRET_KEY = process.env.JWT_SECRET || "hackathon_secret_key";

export interface AttestationPayload {
  wallet: string;
  isNinja: boolean;
  score: number;
  risk: RiskLevel;
  traits: string[];
  intent: string;
}

export const generateAttestation = (payload: AttestationPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};