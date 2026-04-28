<script lang="ts">
  import Seo from "$lib/seo.svelte";
</script>

<Seo
  title="Veesker Community Edition"
  description="The Oracle desktop IDE — free forever under Apache 2.0. Full SQL/PL/SQL IDE, PL/SQL debugger, BYOK AI, vector search, ORDS studio. Works with Oracle 9i through 26ai. No Oracle client required."
  path="/"
/>

<section class="hero">
  <div class="container hero-inner">
    <img src="/ce-logo.png" alt="Veesker Community Edition" class="hero-logo" width="96" height="96" />
    <div class="badge">Community Edition · Free Forever</div>
    <h1>The Oracle IDE,<br/>free forever.</h1>
    <p class="lead">
      Full SQL/PL/SQL IDE, debugger, BYOK AI, vector search, and ORDS studio in one app.
      Works with Oracle 9i through 26ai. No Oracle client required. Apache 2.0.
    </p>
    <div class="cta">
      <a href="/download" class="btn primary">Download free</a>
      <a href="https://github.com/Veesker-Cloud/veesker" class="btn" target="_blank" rel="noopener">View on GitHub</a>
    </div>
    <div class="trust">
      <span>Apache 2.0</span>
      <span>·</span>
      <span>Community Edition</span>
      <span>·</span>
      <span>No telemetry</span>
      <span>·</span>
      <span>Tauri 2 + Svelte 5 + Bun</span>
    </div>
  </div>
</section>

<section class="features">
  <div class="container">
    <h2>Built for Oracle developers, not against them.</h2>
    <div class="feat-grid">
      <div class="feat">
        <div class="ico">📝</div>
        <h3>Multi-statement SQL</h3>
        <p>PL/SQL-aware splitter, per-statement results, query cancellation, virtualized grids for million-row datasets.</p>
      </div>
      <div class="feat">
        <div class="ico">🐑</div>
        <h3>AI — BYOK</h3>
        <p>Bring your own Anthropic key. Explain any SQL and generate SQL from a plain-text description. No usage caps beyond your own plan.</p>
      </div>
      <div class="feat">
        <div class="ico">🔍</div>
        <h3>Vector search studio</h3>
        <p>Embeddings via Ollama / OpenAI / Voyage, HNSW & IVF indexes, 2D PCA scatter with similarity coloring.</p>
      </div>
      <div class="feat">
        <div class="ico">🐞</div>
        <h3>PL/SQL Debugger</h3>
        <p>Breakpoints, step in/over/out, watch variables, call stack, SYS_REFCURSOR result extraction.</p>
      </div>
      <div class="feat">
        <div class="ico">🚀</div>
        <h3>VRAS — REST API Studio</h3>
        <p>Auto-CRUD on tables, custom SQL endpoints, procedure-to-REST mapping, OAuth client management via Oracle ORDS.</p>
      </div>
      <div class="feat">
        <div class="ico">🛡️</div>
        <h3>Production-safe</h3>
        <p>DML confirmation, audit log, EXPLAIN PLAN preview, per-connection environment tags. Zero telemetry.</p>
      </div>
    </div>
  </div>
</section>

<section class="tiers">
  <div class="container">
    <h2>Community Edition vs Veesker Cloud</h2>
    <p class="tiers-lead">The IDE is free forever. Cloud adds managed AI with deep schema context — no API key needed, runs live queries against your database.</p>
    <div class="tier-grid">
      <div class="tier-card ce">
        <div class="tier-header">
          <img src="/ce-logo.png" alt="" width="28" height="28" class="tier-logo" />
          <div>
            <span class="tier-name">Community Edition</span>
            <span class="tier-price">Free forever · Apache 2.0</span>
          </div>
        </div>
        <ul>
          <li>Full SQL / PL/SQL IDE</li>
          <li>PL/SQL debugger</li>
          <li>Schema browser + DataFlow graph</li>
          <li>ORDS / REST API Studio</li>
          <li>Vector search studio</li>
          <li>Terminal (PTY)</li>
          <li>BYOK AI — explain &amp; generate SQL</li>
          <li>Apache 2.0 — fork and self-host freely</li>
        </ul>
        <a href="/download" class="btn primary">Download free</a>
      </div>
      <div class="tier-card cloud">
        <div class="tier-header">
          <span class="tier-icon">☁</span>
          <div>
            <span class="tier-name">Veesker Cloud</span>
            <span class="tier-price">Coming soon</span>
          </div>
        </div>
        <ul>
          <li>Everything in CE, plus:</li>
          <li>Schema-aware AI — knows your tables</li>
          <li>AI runs live queries for context</li>
          <li>Query optimization + performance AI</li>
          <li>AI-generated charts via natural language</li>
          <li>Debugger AI — runtime analysis + suggestions</li>
          <li>No API key required</li>
          <li>Team features + shared queries</li>
          <li>Usage dashboard + billing</li>
        </ul>
        <a href="/pricing" class="btn">See plans →</a>
      </div>
    </div>
  </div>
</section>

<section class="proof">
  <div class="container proof-inner">
    <h2>Open source. No vendor lock-in.</h2>
    <p class="lead">
      The entire IDE is on GitHub under Apache 2.0. No feature gating, no telemetry,
      no license server. Cloud is an optional premium layer — the CE IDE is complete on its own.
    </p>
    <div class="cta">
      <a href="/pricing" class="btn primary">See Cloud plans</a>
      <a href="https://github.com/Veesker-Cloud/veesker/blob/main/COMMERCIAL_USE.md" class="btn" target="_blank" rel="noopener">Commercial-use policy</a>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: 100px 0 60px;
    text-align: center;
    position: relative;
    background:
      radial-gradient(ellipse at top, rgba(179,62,31,0.18), transparent 55%),
      linear-gradient(rgba(10,8,6,0.78), rgba(10,8,6,0.88)),
      url('/workspace-overview.png') center / cover no-repeat;
  }
  .hero-logo {
    width: 96px;
    height: 96px;
    object-fit: contain;
    margin: 0 auto 28px;
    display: block;
    filter: drop-shadow(0 12px 32px rgba(179,62,31,0.25));
  }
  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 100px;
    background: var(--accent-soft);
    color: var(--accent-text);
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 22px;
  }
  h1 {
    font-size: 56px;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin: 0 0 24px;
  }
  .lead {
    font-size: 17.5px;
    line-height: 1.6;
    color: var(--text-muted);
    max-width: 720px;
    margin: 0 auto 32px;
  }
  .cta {
    display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
  }
  .trust {
    margin-top: 36px;
    color: var(--text-muted);
    font-size: 12.5px;
    display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
  }

  .features {
    padding: 80px 0;
  }
  .features h2 {
    text-align: center;
    font-size: 36px;
    margin-bottom: 40px;
  }
  .feat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }
  .feat {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 24px;
  }
  .feat .ico {
    font-size: 28px;
    margin-bottom: 14px;
    height: 36px;
    display: flex;
    align-items: center;
  }
  .feat h3 {
    font-size: 17px;
    margin: 0 0 10px;
  }
  .feat p {
    color: var(--text-muted);
    font-size: 13.5px;
    line-height: 1.55;
    margin: 0;
  }

  /* CE vs Cloud tiers */
  .tiers {
    padding: 0 0 80px;
  }
  .tiers h2 {
    text-align: center;
    font-size: 32px;
    margin-bottom: 14px;
  }
  .tiers-lead {
    text-align: center;
    color: var(--text-muted);
    font-size: 15px;
    line-height: 1.6;
    max-width: 660px;
    margin: 0 auto 36px;
  }
  .tier-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    max-width: 860px;
    margin: 0 auto;
  }
  .tier-card {
    border-radius: 12px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .tier-card.ce {
    background: linear-gradient(160deg, rgba(126,201,106,0.07), rgba(126,201,106,0.02));
    border: 1px solid rgba(126,201,106,0.3);
  }
  .tier-card.cloud {
    background: linear-gradient(160deg, rgba(106,160,245,0.07), rgba(106,160,245,0.02));
    border: 1px solid rgba(106,160,245,0.3);
  }
  .tier-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .tier-logo {
    object-fit: contain;
    flex-shrink: 0;
  }
  .tier-icon {
    font-size: 24px;
    width: 28px;
    text-align: center;
    flex-shrink: 0;
  }
  .tier-name {
    display: block;
    font-weight: 700;
    font-size: 15px;
  }
  .tier-card.ce .tier-name { color: #7ec96a; }
  .tier-card.cloud .tier-name { color: #6aa0f5; }
  .tier-price {
    display: block;
    font-size: 11.5px;
    color: var(--text-muted);
    margin-top: 1px;
  }
  .tier-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
  }
  .tier-card li {
    padding: 6px 0;
    font-size: 13.5px;
    color: var(--text-muted);
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .tier-card li:first-child { border-top: none; }
  .tier-card li::before { content: "✓ "; color: var(--accent-text); }
  .tier-card.cloud li:first-child::before { content: ""; }

  .proof {
    padding: 80px 0;
    text-align: center;
    background: var(--bg-soft);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .proof h2 {
    font-size: 32px;
    margin-bottom: 16px;
  }

  @media (max-width: 880px) {
    h1 { font-size: 40px; }
    .feat-grid { grid-template-columns: 1fr; }
    .tier-grid { grid-template-columns: 1fr; }
  }
</style>
