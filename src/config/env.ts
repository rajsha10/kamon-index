import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || "4000",
  MONGO_URI: process.env.MONGO_URI || "",
  INJECTIVE_API_URL: process.env.INJECTIVE_API_URL || "",
  INJECTIVE_LCD_URL: process.env.INJECTIVE_LCD_URL || "",
  INJECTIVE_INDEXER_URL: process.env.INJECTIVE_INDEXER_URL || "",
  INJECTIVE_EXPLORER_URL: process.env.INJECTIVE_EXPLORER_URL || "",
  NETWORK: (process.env.NETWORK || "mainnet") as any,
};
