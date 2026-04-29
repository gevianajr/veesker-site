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
        <span class="brand-name">VEESKER</span>
        <span class="brand-kicker">Oracle Platform</span>
      </span>
    </a>
    <nav>
      <a href="/features">Features</a>
      <a href="/#community">Community</a>
      <a href="/#cloud">Cloud</a>
      <a href="/pricing">Pricing</a>
      <a href="/docs">Docs</a>
      <a href="https://github.com/gevianajr/veesker" target="_blank" rel="noopener" class="nav-gh">
        <svg class="gh-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.25.79-.56v-1.99c-3.2.69-3.88-1.36-3.88-1.36-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.72-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.42-2.7 5.39-5.27 5.67.41.35.78 1.05.78 2.11v3.13c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
          />
        </svg>
        <span>GitHub</span>
      </a>
      <a href="/download" class="btn primary nav-download">
        <span class="nav-btn-icon-wrap">
          <img src="/veesker-community-logo.png" alt="" aria-hidden="true" class="nav-btn-icon" width="1024" height="1024" />
        </span>
        <span>Download Community</span>
      </a>
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
        <a href="https://github.com/gevianajr/veesker" target="_blank" rel="noopener">GitHub</a>
        <a href="https://github.com/gevianajr/veesker/issues" target="_blank" rel="noopener">Issues</a>
      </div>
      <div>
        <h4>Legal</h4>
        <a href="https://github.com/gevianajr/veesker/blob/main/LICENSE" target="_blank" rel="noopener">License (Apache 2.0)</a>
        <a href="https://github.com/gevianajr/veesker/blob/main/COMMERCIAL_USE.md" target="_blank" rel="noopener">Commercial Use</a>
        <a href="https://github.com/gevianajr/veesker/blob/main/TERMS_OF_USE.md" target="_blank" rel="noopener">Terms of Use</a>
        <a href="https://github.com/gevianajr/veesker/blob/main/SECURITY.md" target="_blank" rel="noopener">Security</a>
      </div>
    </div>
    <div class="foot-bottom muted">
      Created by <a href="https://github.com/gevianajr" target="_blank" rel="noopener">Geraldo Ferreira Viana Júnior</a> · Designed 2022 · Shipped 2026 · São Paulo, Brazil ·
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
    line-height: 1;
  }
  .brand-name {
    font-size: 31px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #f7f8fb;
    text-shadow:
      0 0 1px rgba(247, 248, 251, 0.55),
      0 1px 0 rgba(0, 0, 0, 0.55);
  }
  .brand-kicker {
    margin-top: 3px;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.13em;
    color: rgba(245, 241, 232, 0.56);
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
  .nav-gh {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 11px;
    border-radius: 8px;
    border: 1px solid rgba(245, 241, 232, 0.18);
    background: rgba(18, 17, 16, 0.86);
    color: rgba(245, 241, 232, 0.9);
    transition: border-color 0.14s ease, background 0.14s ease, color 0.14s ease;
  }
  nav a.nav-gh:hover {
    color: #fff;
    border-color: rgba(245, 241, 232, 0.34);
    background: rgba(26, 24, 22, 0.96);
  }
  .gh-icon {
    width: 14px;
    height: 14px;
    fill: currentColor;
    display: block;
  }
  .nav-download {
    gap: 8px;
    padding-left: 10px;
  }
  .nav-btn-icon-wrap {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(255, 230, 220, 0.55);
    background: rgba(120, 44, 25, 0.42);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }
  .nav-btn-icon {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 50%;
    display: block;
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
    .brand-name {
      font-size: 24px;
      letter-spacing: 0.05em;
    }
    .foot-cols {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
