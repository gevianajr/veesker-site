<script lang="ts">
  import Seo from "$lib/seo.svelte";
</script>

<Seo
  title="Veesker"
  description="Open-source desktop IDE for Oracle 23ai. Multi-statement SQL editor with virtualized grids, PL/SQL debugger, AI assistant with database access, vector search studio, and a no-code REST API builder — all in one app, Apache 2.0."
  path="/"
/>

<section class="hero">
  <div class="container hero-inner">
    <img src="/veesker-logo.png" alt="Veesker" class="hero-logo" width="96" height="96" />
    <div class="badge">Open source · Apache 2.0</div>
    <h1>The Oracle 23ai studio for<br/>SQL, AI, vectors, and APIs.</h1>
    <p class="lead">
      A native desktop IDE for Oracle 23ai. Multi-statement SQL editor with virtualized grids,
      a PL/SQL debugger, an AI assistant with live database access, a vector search studio,
      and a no-code REST API builder — all in one app, no Oracle client required.
    </p>
    <div class="cta">
      <a href="/download" class="btn primary">Download for Windows</a>
      <a href="https://github.com/gevianajr/veesker" class="btn" target="_blank" rel="noopener">View on GitHub</a>
    </div>
    <div class="trust">
      <span>Apache 2.0</span>
      <span>·</span>
      <span>Tauri 2 + Svelte 5 + Bun</span>
      <span>·</span>
      <span>No telemetry</span>
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
        <div class="ico"><img src="/veesker-logo.png" alt="" width="36" height="36" /></div>
        <h3>Veesker AI</h3>
        <p>An assistant that runs live SELECT queries against your schema to answer questions. Not autocomplete — actual database access.</p>
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
        <p>Auto-CRUD on tables, custom SQL endpoints, procedure-to-REST mapping, OAuth client management. All via Oracle ORDS.</p>
      </div>
      <div class="feat">
        <div class="ico">🛡️</div>
        <h3>Production-safe</h3>
        <p>DML confirmation, audit log, EXPLAIN PLAN preview, per-connection environment tags. Zero telemetry.</p>
      </div>
    </div>
  </div>
</section>

<section class="overview">
  <div class="container">
    <h2>Everything in one workspace.</h2>
    <p class="lead">Schema browser, DataFlow graph, AI assistant, SQL editor, query history, and results grid — all visible at once.</p>
    <img
      src="/workspace-overview.png"
      alt="Veesker workspace — schema tree, DataFlow graph, Veesker AI, SQL editor with results"
      class="overview-img"
    />
  </div>
</section>

<section class="proof">
  <div class="container proof-inner">
    <h2>Open source. No vendor lock-in.</h2>
    <p class="lead">
      The entire codebase is on GitHub under Apache License 2.0. No feature gating, no telemetry,
      no license server check. Larger organizations support development through a paid subscription —
      same model as Docker Desktop.
    </p>
    <div class="cta">
      <a href="/pricing" class="btn primary">See pricing</a>
      <a href="https://github.com/gevianajr/veesker/blob/main/COMMERCIAL_USE.md" class="btn" target="_blank" rel="noopener">Read commercial-use policy</a>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: 100px 0 60px;
    text-align: center;
    background: radial-gradient(ellipse at top, rgba(179,62,31,0.12), transparent 60%);
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
  .feat .ico img {
    width: 36px;
    height: 36px;
    object-fit: contain;
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

  .overview {
    padding: 60px 0 80px;
    text-align: center;
  }
  .overview h2 {
    font-size: 32px;
    margin-bottom: 12px;
  }
  .overview .lead {
    margin-bottom: 36px;
  }
  .overview-img {
    width: 100%;
    max-width: 1100px;
    border-radius: 10px;
    border: 1px solid var(--border);
    box-shadow: 0 24px 80px rgba(0,0,0,0.45);
    display: block;
    margin: 0 auto;
  }

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
  }
</style>
