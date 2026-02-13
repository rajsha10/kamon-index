# Kamon Index : Injective Trust & Identity Layer

**Kamon Index is a trust and identity infrastructure for Injective that analyzes wallet maturity, activity, economic stake, governance participation, and N1NJ4 identity to produce Sybil-resistant reputation scores for dApps.**

---

## 📖 Overview

**Kamon Index** is an identity and reputation API built for the Ninja API Forge.

It transforms raw on-chain wallet activity and N1NJ4 identity signals into
**actionable trust profiles** that help developers:

- Detect bots and sybil accounts
- Verify legitimate users
- Build trust-aware features
- Secure community and governance systems

Instead of forcing every team to implement their own heuristics,
Kamon Index provides a reusable **trust primitive** for the Injective ecosystem.

---

## 🚀 Why Kamon Index?

Developers on Injective face three major challenges:

- ❌ No standardized wallet reputation system
- ❌ Difficulty distinguishing real users from bots
- ❌ Fragmented and noisy on-chain data

Kamon Index solves this by providing:

✔️ A unified trust score (0–100)  
✔️ Risk classification  
✔️ Bot probability estimation  
✔️ Signed attestations  
✔️ N1NJ4-aware identity layer  

All through clean, well-documented APIs.

---

## 🥷 N1NJ4 Identity Integration

Kamon Index integrates with the N1NJ4 identity system.

Wallets with verified N1NJ4 identity:

- Receive trust bonuses
- Access higher API quotas
- Unlock advanced features

Current implementation is modular and upgradeable to full on-chain CW721
verification when official endpoints are standardized.

---

## 🏗️ Architecture

```
┌──────────────────────┐
│   Injective LCD      │  On-chain data source
│   (Mainnet/Testnet)  │  Txs, balances, staking, governance
└─────────┬────────────┘
          │
          ▼
┌──────────────────────┐
│   Data Collector     │  Fetches wallet activity via
│                      │  @injectivelabs/sdk-ts
└─────────┬────────────┘
          │
          ▼
┌──────────────────────┐
│   Scoring Engine     │  Computes trust score (0–100),
│                      │  risk level, bot probability
└─────────┬────────────┘
          │
          ▼
┌──────────────────────┐
│   Identity Layer     │  N1NJ4 NFT verification
│   (N1NJ4)            │  CW721 ownership check
└─────────┬────────────┘
          │
          ▼
┌──────────────────────┐
│   Kamon Index API    │  REST endpoints serving
│                      │  trust profiles & attestations
└──────────────────────┘
```

---

### Data Sources

- Account Metadata (LCD)
- Transaction History
- Token Balances
- Staking Delegations
- Governance Participation

### Core Modules

- Activity Analyzer
- Trust Scoring Engine
- Identity Tier System
- JWT Attestation Service
- Intent Classifier
- Cache Layer

---

## 📊 Trust Scoring Model

Trust scores range from **0 to 100**.

### Signals & Weights

```

| Signal                | Weight  |
|-----------------------|---------|
| Transaction Activity  | 20      |
| Wallet Age            | 20      |
| Token Balances        | 15      |
| Staking Participation | 15      |
| Governance Activity   | 10      |
| N1NJ4 Identity        | 10      |
| Bot Heuristics        | -10     |
```
### Risk Levels
```
| Score Range | Risk   |
|-------------|--------|
| 65–100      | LOW    |
| 35–64       | MEDIUM |
| 0–34        | HIGH   |

```
---

## API Endpoints

Base URL: `http://localhost:4000`

### GET `/trust/:wallet`

Returns a full trust profile for the given wallet address.

**Response:**

```json
{
  "wallet": "inj1...",
  "verified_ninja": true,
  "trust_score": 72,
  "risk": "LOW",
  "bot_probability": 0.1,
  "intent": {
    "label": "STABLE",
    "confidence": 0.9
  },
  "tags": ["N1NJ4_VERIFIED", "STAKER", "ACTIVE"],
  "last_active": "2025-01-15T12:00:00Z",
  "attestation": "<jwt_token>"
}
```

**Intent Labels:**
- `STABLE` — Default, normal activity
- `HIGH_FREQUENCY_MAKER` — tradeCount > 50
- `MARKET_EXPLORER` — active in 5+ markets
- `POTENTIAL_BOT_ARBITRAGE` — bot probability > 0.6

### POST `/trust/compare`

Compares two wallets and returns the more trustworthy one.

**Request Body:**

```json
{
  "walletA": "inj1...",
  "walletB": "inj1..."
}
```

**Response:**

```json
{
  "winner": "walletA",
  "reason": ["N1NJ4_HOLDER", "STAKER", "MORE_TRADES"],
  "scores": {
    "A": 72,
    "B": 34
  }
}
```

### GET `/trust/debug/:wallet`

Returns raw activity data and scoring breakdown. Only available when `DEBUG_MODE=true`.

**Response:**

```json
{
  "wallet": "inj1...",
  "activity": {
    "txCount": 3498145,
    "balanceCount": 1,
    "stakeCount": 0
  },
  "scoring": {
    "value": 35,
    "risk": "MEDIUM",
    "botProb": 0.3
  }
}
```

### GET `/health`

Health check endpoint.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB
- Redis (optional, for caching)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/N1NJ4_Insight_API.git
cd N1NJ4_Insight_API

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Run in development
npm run dev

# Build and run for production
npm run build
npm start
```

### Environment Variables
```
|   Variable   | Required | Default | Description |
|--------------|----------|---------|-------------|
|    `PORT`    |    No    |  `4000` | Server port |
|   `NETWORK`  |    Yes   |`mainnet`| `mainnet`, `testnet`, or `devnet` |
|  `MONGO_URI` |    Yes   |    —    | MongoDB connection string |
| `JWT_SECRET` |    Yes   |    —    | Secret key for signing attestation JWTs |
|  `REDIS_URL` |    No    |    —    | Redis connection string for caching |
| `DEBUG_MODE` |    No    | `false` | Enables `/trust/debug/:wallet` endpoint |
```
---

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **Blockchain SDK:** @injectivelabs/sdk-ts
- **Database:** MongoDB (Mongoose)
- **Cache:** Redis
- **Auth:** JWT (jsonwebtoken)
- **Scheduling:** node-cron

---

## Project Structure

```
src/
├── app.ts                  # Express app setup
├── server.ts               # Entry point
├── config/
│   ├── db.ts               # MongoDB connection
│   └── env.ts              # Environment config
├── controllers/
│   └── trust.controller.ts # Request handlers
├── routes/
│   └── trust.routes.ts     # Route definitions
├── services/
│   ├── injective.service.ts  # On-chain data fetching
│   ├── scoring.service.ts    # Trust score computation
│   ├── n1nj4.service.ts      # N1NJ4 NFT verification
│   ├── attestation.service.ts # JWT attestation signing
│   ├── trading.service.ts    # Trade activity analysis
│   ├── activity.service.ts   # Wallet activity aggregation
│   ├── chain.service.ts      # Chain-level queries
│   └── client.service.ts     # SDK client setup
├── models/
│   └── Wallet.model.ts     # Wallet schema
├── middlewares/
│   └── error.middleware.ts  # Error handler
├── jobs/
│   └── sync.job.ts         # Scheduled data sync
├── types/
│   └── trust.types.ts      # TypeScript interfaces
└── utils/
    └── logger.ts            # Logging utility
```

---

## 🔐 Attestations

Each trust profile includes a signed JWT attestation.

These attestations allow third-party dApps to verify:

- Wallet identity
- Trust score
- Risk level
- Traits

Without re-computing analytics.

---

## 💡 Example Use Case

A DAO using Kamon Index:

1. Queries wallet trust profile
2. Blocks wallets with `HIGH` risk
3. Allows only `MEDIUM`+ to vote
4. Gives bonuses to `LOW` risk users
5. Verifies attestations

This enables fully Sybil-resistant governance.

---

## 🏆 Notes for Judges

- All analytics are computed server-side
- No raw Injective payloads are exposed
- Architecture is modular and extensible
- Identity layer supports future DID upgrades
- Debug endpoint enables transparency
- Designed as reusable infrastructure

---

## License
MIT

---

## 🙌 Acknowledgements

Built for Ninja API Forge and the Injective ecosystem.
Powered by N1NJ4 identity primitives.
