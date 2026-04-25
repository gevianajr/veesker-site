<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<header class="site-header">
  <div class="container nav">
    <a href="/" class="brand">
      <span class="brand-mark">▲</span>
      <span class="brand-name">veesker</span>
    </a>
    <nav>
      <a href="/features">Features</a>
      <a href="/pricing">Pricing</a>
      <a href="/docs">Docs</a>
      <a href="/contact">Contact</a>
      <a href="https://github.com/geeviana/veesker" target="_blank" rel="noopener">GitHub ↗</a>
      <a href="/download" class="btn primary">Download</a>
    </nav>
  </div>
</header>

<main>
  {@render children()}
</main>

<footer class="site-footer">
  <div class="container foot">
    <div class="foot-cols">
      <div>
        <strong>Veesker</strong>
        <p class="muted">The Oracle 23ai studio.</p>
      </div>
      <div>
        <h4>Product</h4>
        <a href="/features">Features</a>
        <a href="/pricing">Pricing</a>
        <a href="/download">Download</a>
      </div>
      <div>
        <h4>Resources</h4>
        <a href="/docs">Documentation</a>
        <a href="https://github.com/geeviana/veesker" target="_blank" rel="noopener">GitHub</a>
        <a href="https://github.com/geeviana/veesker/issues" target="_blank" rel="noopener">Issues</a>
      </div>
      <div>
        <h4>Legal</h4>
        <a href="https://github.com/geeviana/veesker/blob/main/LICENSE" target="_blank" rel="noopener">License (Apache 2.0)</a>
        <a href="https://github.com/geeviana/veesker/blob/main/COMMERCIAL_USE.md" target="_blank" rel="noopener">Commercial Use</a>
        <a href="https://github.com/geeviana/veesker/blob/main/TERMS_OF_USE.md" target="_blank" rel="noopener">Terms of Use</a>
        <a href="https://github.com/geeviana/veesker/blob/main/SECURITY.md" target="_blank" rel="noopener">Security</a>
      </div>
    </div>
    <div class="foot-bottom muted">
      © 2026 Geraldo F. Viana Júnior · São Paulo, Brazil · Made with care
    </div>
  </div>
</footer>

<style>
  .site-header {
    position: sticky;
    top: 0;
    background: rgba(14, 12, 10, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    z-index: 100;
  }
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
  }
  .brand {
    display: flex; align-items: center; gap: 8px;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: var(--text);
    text-decoration: none;
  }
  .brand-mark { color: var(--accent-text); font-size: 22px; }
  .brand:hover { text-decoration: none; }

  nav {
    display: flex;
    gap: 22px;
    align-items: center;
  }
  nav a {
    color: var(--text-muted);
    font-size: 13.5px;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 500;
    transition: color 0.12s;
  }
  nav a:hover {
    color: var(--text);
    text-decoration: none;
  }
  nav a.btn { color: #fff; }

  main {
    min-height: calc(100vh - 200px);
  }

  .site-footer {
    margin-top: 80px;
    padding: 50px 0 30px;
    border-top: 1px solid var(--border);
    background: var(--bg-soft);
  }
  .foot-cols {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    padding: 0 24px;
  }
  .foot-cols h4 {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0 0 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .foot-cols a {
    display: block;
    color: var(--text);
    margin: 6px 0;
    font-size: 13px;
    text-decoration: none;
  }
  .foot-cols a:hover { color: var(--accent-text); }
  .foot-cols p.muted {
    color: var(--text-muted);
    font-size: 13px;
    margin: 8px 0 0;
  }
  .foot-bottom {
    margin-top: 36px;
    padding: 16px 24px 0;
    border-top: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 12px;
    text-align: center;
  }

  @media (max-width: 720px) {
    .nav { flex-direction: column; gap: 12px; }
    nav { flex-wrap: wrap; justify-content: center; }
    .foot-cols { grid-template-columns: 1fr 1fr; }
  }
</style>
