<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<header class="site-header">
  <div class="container nav">
    <a href="/" class="brand">
      <span class="brand-mark">
        <img src="/app-icon.png" alt="Veesker" class="brand-logo" width="36" height="36" />
      </span>
      <span class="brand-meta">
        <span class="brand-name">Veesker</span>
        <span class="brand-kicker">Oracle Platform</span>
      </span>
    </a>
    <nav>
      <a href="/features">Features</a>
      <a href="/#community">Community</a>
      <a href="/#cloud">Cloud</a>
      <a href="/pricing">Pricing</a>
      <a href="/docs">Docs</a>
      <a href="https://github.com/Veesker-Cloud/veesker" target="_blank" rel="noopener">GitHub -&gt;</a>
      <a href="/download" class="btn primary">Download Community</a>
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
        <p class="muted">The Oracle platform for local-first development and managed intelligence.</p>
      </div>
      <div>
        <h4>Product</h4>
        <a href="/#community">Community</a>
        <a href="/#cloud">Cloud</a>
        <a href="/features">Features</a>
        <a href="/pricing">Pricing</a>
        <a href="/download">Download Community</a>
      </div>
      <div>
        <h4>Resources</h4>
        <a href="/docs">Documentation</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="https://github.com/Veesker-Cloud/veesker" target="_blank" rel="noopener">GitHub</a>
        <a href="https://github.com/Veesker-Cloud/veesker/issues" target="_blank" rel="noopener">Issues</a>
      </div>
      <div>
        <h4>Legal</h4>
        <a href="https://github.com/Veesker-Cloud/veesker/blob/main/LICENSE" target="_blank" rel="noopener">License (Apache 2.0)</a>
        <a href="https://github.com/Veesker-Cloud/veesker/blob/main/COMMERCIAL_USE.md" target="_blank" rel="noopener">Commercial Use</a>
        <a href="https://github.com/Veesker-Cloud/veesker/blob/main/TERMS_OF_USE.md" target="_blank" rel="noopener">Terms of Use</a>
        <a href="https://github.com/Veesker-Cloud/veesker/blob/main/SECURITY.md" target="_blank" rel="noopener">Security</a>
      </div>
    </div>
    <div class="foot-bottom muted">
      Created by <a href="https://github.com/gevianajr" target="_blank" rel="noopener">Geraldo Ferreira Viana Junior</a> - Designed 2022 - Shipped 2026 - Sao Paulo, Brazil -
      <a href="https://www.linkedin.com/in/geraldovianajr/" target="_blank" rel="noopener">LinkedIn</a>
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
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 8px;
    border-radius: 10px;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 600;
    color: var(--text);
    text-decoration: none;
    transition: background 0.14s ease;
  }
  .brand:hover {
    text-decoration: none;
    background: rgba(255, 255, 255, 0.04);
  }
  .brand-mark {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: linear-gradient(180deg, rgba(21, 19, 17, 0.95), rgba(14, 12, 10, 0.95));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28);
  }
  .brand-logo {
    width: 32px;
    height: 32px;
    object-fit: cover;
    display: block;
  }
  .brand-meta {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
  }
  .brand-name {
    font-size: 27px;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: #f5f1e8;
  }
  .brand-kicker {
    margin-top: 4px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(245, 241, 232, 0.54);
  }

  nav {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  nav a {
    color: var(--text-muted);
    font-size: 13.5px;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 500;
    transition: color 0.12s;
    white-space: nowrap;
  }
  nav a:hover {
    color: var(--text);
    text-decoration: none;
  }
  nav a.btn {
    color: #fff;
  }

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
  .foot-cols a:hover {
    color: var(--accent-text);
  }
  .foot-cols p.muted {
    color: var(--text-muted);
    font-size: 13px;
    margin: 8px 0 0;
    line-height: 1.6;
  }
  .foot-bottom {
    margin-top: 36px;
    padding: 16px 24px 0;
    border-top: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 12px;
    text-align: center;
    line-height: 1.6;
  }

  @media (max-width: 860px) {
    .nav {
      flex-direction: column;
      gap: 12px;
    }
    nav {
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }
    .brand-kicker {
      display: none;
    }
    .foot-cols {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
