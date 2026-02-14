import express from "express";
import cors from "cors";
import trustRoutes from "./routes/trust.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kamon Index API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0a0a0f;
      color: #e0e0e0;
      min-height: 100vh;
      padding: 2rem;
    }
    .container { max-width: 900px; margin: 0 auto; }
    .header {
      text-align: center;
      margin-bottom: 2.5rem;
      padding: 2rem 0;
      border-bottom: 1px solid #1a1a2e;
    }
    .header h1 {
      font-size: 2.4rem;
      background: linear-gradient(135deg, #00d2ff, #7b2ff7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }
    .header .ninja { font-size: 2.8rem; margin-bottom: 0.5rem; }
    .header p { color: #888; font-size: 1.05rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }
    .badge {
      display: inline-block;
      background: #7b2ff720;
      border: 1px solid #7b2ff740;
      color: #b388ff;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.8rem;
      margin-top: 1rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 2.5rem;
    }
    .stat {
      background: #111118;
      border: 1px solid #1a1a2e;
      border-radius: 12px;
      padding: 1.2rem;
      text-align: center;
    }
    .stat .value { font-size: 1.8rem; font-weight: 700; color: #00d2ff; }
    .stat .label { font-size: 0.85rem; color: #666; margin-top: 0.3rem; }
    h2 {
      font-size: 1.3rem;
      color: #fff;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .endpoints { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
    .endpoint {
      background: #111118;
      border: 1px solid #1a1a2e;
      border-radius: 12px;
      padding: 1.2rem 1.5rem;
      transition: border-color 0.2s;
    }
    .endpoint:hover { border-color: #7b2ff760; }
    .endpoint .method {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-right: 0.5rem;
    }
    .get { background: #00d2ff20; color: #00d2ff; }
    .post { background: #ff9f0020; color: #ff9f00; }
    .endpoint .path { font-family: 'Fira Code', monospace; font-size: 0.95rem; color: #fff; }
    .endpoint .desc { color: #777; font-size: 0.85rem; margin-top: 0.4rem; }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 2.5rem;
    }
    .feature {
      background: #111118;
      border: 1px solid #1a1a2e;
      border-radius: 12px;
      padding: 1.2rem;
    }
    .feature .icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .feature h3 { font-size: 1rem; color: #fff; margin-bottom: 0.3rem; }
    .feature p { font-size: 0.85rem; color: #777; line-height: 1.5; }
    .footer {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #1a1a2e;
      color: #444;
      font-size: 0.85rem;
    }
    .footer a { color: #7b2ff7; text-decoration: none; }
    code {
      background: #1a1a2e;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.85rem;
      color: #00d2ff;
    }
    .try-it {
      margin-bottom: 2.5rem;
      background: #111118;
      border: 1px solid #1a1a2e;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .try-it pre {
      background: #0a0a0f;
      border-radius: 8px;
      padding: 1rem;
      overflow-x: auto;
      font-size: 0.85rem;
      color: #00d2ff;
      margin-top: 0.8rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="ninja">&#x1F977;</div>
      <h1>Kamon Index API</h1>
      <p>Trust &amp; Identity Infrastructure for Injective - Sybil-resistant reputation scores powered by on-chain analytics and N1NJ4 identity.</p>
      <span class="badge">Built for Ninja API Forge</span>
    </div>

    <div class="stats">
      <div class="stat"><div class="value">0&ndash;100</div><div class="label">Trust Score Range</div></div>
      <div class="stat"><div class="value">6</div><div class="label">On-chain Signals</div></div>
      <div class="stat"><div class="value">3</div><div class="label">Risk Levels</div></div>
      <div class="stat"><div class="value">JWT</div><div class="label">Signed Attestations</div></div>
    </div>

    <h2>API Endpoints</h2>
    <div class="endpoints">
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/trust/:wallet</span>
        <div class="desc">Full trust profile &mdash; score, risk level, bot probability, intent classification, N1NJ4 verification &amp; signed attestation.</div>
      </div>
      <div class="endpoint">
        <span class="method post">POST</span>
        <span class="path">/trust/compare</span>
        <div class="desc">Compare two wallets side-by-side and determine the more trustworthy one with reasoning.</div>
      </div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/trust/debug/:wallet</span>
        <div class="desc">Raw activity data &amp; scoring breakdown for full transparency (when DEBUG_MODE=true).</div>
      </div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/health</span>
        <div class="desc">Health check &mdash; verify the API is running.</div>
      </div>
    </div>

    <h2>Try It</h2>
    <div class="try-it">
      <p style="color:#888; font-size:0.9rem;">Query a wallet's trust profile:</p>
      <pre>curl http://localhost:4000/trust/inj1...</pre>
      <p style="color:#888; font-size:0.9rem; margin-top:1rem;">Compare two wallets:</p>
      <pre>curl -X POST http://localhost:4000/trust/compare \\
  -H "Content-Type: application/json" \\
  -d '{"walletA":"inj1...","walletB":"inj1..."}'</pre>
    </div>

    <h2>Core Capabilities</h2>
    <div class="features">
      <div class="feature">
        <div class="icon">&#x1F50D;</div>
        <h3>On-Chain Analytics</h3>
        <p>Analyzes transactions, balances, staking, and governance participation from Injective mainnet.</p>
      </div>
      <div class="feature">
        <div class="icon">&#x1F977;</div>
        <h3>N1NJ4 Identity</h3>
        <p>Wallets with verified N1NJ4 NFTs receive trust bonuses and access higher tiers.</p>
      </div>
      <div class="feature">
        <div class="icon">&#x1F916;</div>
        <h3>Bot Detection</h3>
        <p>Heuristic-based bot probability scoring to identify Sybil accounts and automated wallets.</p>
      </div>
      <div class="feature">
        <div class="icon">&#x1F4DC;</div>
        <h3>Signed Attestations</h3>
        <p>JWT-signed trust profiles that dApps can verify without re-computing analytics.</p>
      </div>
      <div class="feature">
        <div class="icon">&#x1F3AF;</div>
        <h3>Intent Classification</h3>
        <p>Labels wallets as STABLE, HIGH_FREQUENCY_MAKER, MARKET_EXPLORER, or POTENTIAL_BOT.</p>
      </div>
      <div class="feature">
        <div class="icon">&#x26A1;</div>
        <h3>Redis Caching</h3>
        <p>Fast responses with intelligent caching layer for repeated queries.</p>
      </div>
    </div>

    <div class="footer">
      <p>Kamon Index - Trust infrastructure for Injective</p>
      <p style="margin-top:0.5rem;">Node.js + TypeScript &bull; Express &bull; @injectivelabs/sdk-ts &bull; MongoDB &bull; Redis</p>
    </div>
  </div>
</body>
</html>
  `);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/trust", trustRoutes);

export default app;
