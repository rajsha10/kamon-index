import mongoose from "mongoose";
import { ENV } from "../src/config/env";
import { Wallet } from "../src/models/Wallet.model";

const seed = async () => {
  await mongoose.connect(ENV.MONGO_URI);
  console.log("Seeding database...");

  const wallets = [
    { address: "inj1exampleaddr1", tags: ["N1NJ4_HOLDER"], verified_ninja: true, trust_score: 85 },
    { address: "inj1exampleaddr2", tags: ["NEW_USER"], verified_ninja: false, trust_score: 50 },
  ];

  for (const w of wallets) {
    await Wallet.updateOne({ address: w.address }, w, { upsert: true });
  }

  console.log(`Seeded ${wallets.length} wallets`);
  await mongoose.disconnect();
};

seed().catch(console.error);
