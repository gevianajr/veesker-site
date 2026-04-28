<script lang="ts">
  import { browser } from "$app/environment";
  import Seo from "$lib/seo.svelte";
  import { onMount } from "svelte";

  let activeLayer: "community" | "cloud" | null = null;

  function updateActiveLayerFromHash() {
    if (!browser) return;
    const hash = window.location.hash.toLowerCase();
    activeLayer = hash === "#community" ? "community" : hash === "#cloud" ? "cloud" : null;
  }

  onMount(() => {
    updateActiveLayerFromHash();
    window.addEventListener("hashchange", updateActiveLayerFromHash);
    return () => window.removeEventListener("hashchange", updateActiveLayerFromHash);
  });
</script>

<Seo
  title="Veesker Platform"
  description="Veesker is the Oracle platform with a free open-source Community IDE and an optional Cloud intelligence layer. Keep database access local and add schema-aware managed AI when you need it."
  path="/"
/>

<section class="hero">
  <div class="container hero-inner">
    <picture class="hero-logo-wrap">
      <source
        type="image/avif"
        srcset="/veesker-master-logo-480.avif 480w, /veesker-master-logo-960.avif 960w"
        sizes="(max-width: 600px) 220px, 300px"
      />
      <source
        type="image/webp"
        srcset="/veesker-master-logo-480.webp 480w, /veesker-master-logo-960.webp 960w"
        sizes="(max-width: 600px) 220px, 300px"
      />
      <img src="/veesker-master-logo.png" alt="Veesker Platform" class="hero-logo" width="1536" height="1024" />
    </picture>
    <div class="badge">Veesker Platform - Community + Cloud</div>
    <h1>The Oracle IDE,<br />free forever.</h1>
    <p class="lead">
      Free local-first Oracle IDE now. Optional Veesker Cloud Beta when your team needs managed intelligence.
    </p>

    <div class="hero-chips" aria-label="Primary value claims">
      <span>Free and open source</span>
      <span>Database stays local</span>
      <span>Cloud is optional</span>
    </div>

    <div class="cta">
      <a href="/download" class="btn primary">Download Community</a>
      <a href="/pricing#cloud" class="btn cloud">Explore Cloud</a>
    </div>

    <div class="signals" aria-label="Trust and product signals">
      <div class="signal">Apache 2.0</div>
      <div class="signal">No forced subscription</div>
      <div class="signal">Open-source on GitHub</div>
      <div class="signal">Cloud Beta active</div>
    </div>
  </div>
</section>

<section class="features">
  <div class="container">
    <h2>Community Edition is complete, local-first, and built for Oracle developers.</h2>
    <div class="feat-grid">
      <div class="feat">
        <div class="ico">SQL</div>
        <h3>Full SQL and PL/SQL IDE</h3>
        <p>Run multi-statement SQL, inspect large result sets, and debug production-grade PL/SQL workflows.</p>
      </div>
      <div class="feat">
        <div class="ico">DBG</div>
        <h3>PL/SQL debugger</h3>
        <p>Breakpoints, step controls, watches, call stack, DBMS_OUTPUT capture, and cursor extraction.</p>
      </div>
      <div class="feat">
        <div class="ico">SMA</div>
        <h3>Schema browser</h3>
        <p>Explore object graphs, inspect dependencies, and navigate large Oracle schemas with less friction.</p>
      </div>
      <div class="feat">
        <div class="ico">API</div>
        <h3>VRAS basic workflows</h3>
        <p>Build ORDS endpoints faster with API studio workflows integrated into your Oracle workspace.</p>
      </div>
      <div class="feat">
        <div class="ico">VEC</div>
        <h3>Vector tools</h3>
        <p>Create embeddings, tune indexes, and run similarity workflows with local or managed providers.</p>
      </div>
      <div class="feat">
        <div class="ico">AI</div>
        <h3>BYOK AI</h3>
        <p>Bring your own key for explain-and-generate assistance without forcing your workflow into a paywall.</p>
      </div>
    </div>
  </div>
</section>

<section class="platform" aria-labelledby="platform-title">
  <div class="container">
    <h2 id="platform-title">Community and Cloud, one platform.</h2>
    <p class="platform-lead">
      Start local with the open-source IDE. Add Veesker Cloud when your team needs managed intelligence.
    </p>
    <p class="layer-focus-note">
      {#if activeLayer === "community"}
        Focus: Community Edition (local-first open-source IDE).
      {:else if activeLayer === "cloud"}
        Focus: Veesker Cloud (optional managed intelligence layer).
      {:else}
        Compare both side by side.
      {/if}
    </p>

    <div class="layer-grid">
      <article
        class="layer-card community"
        id="community"
        class:focused={activeLayer === "community"}
        class:unfocused={activeLayer === "cloud"}
      >
        <div class="layer-head">
          <picture class="layer-art-wrap">
            <source
              type="image/avif"
              srcset="/veesker-community-logo-320.avif 320w, /veesker-community-logo-640.avif 640w"
              sizes="(max-width: 980px) 90px, 112px"
            />
            <source
              type="image/webp"
              srcset="/veesker-community-logo-320.webp 320w, /veesker-community-logo-640.webp 640w"
              sizes="(max-width: 980px) 90px, 112px"
            />
            <img
              src="/veesker-community-logo.png"
              alt="Veesker Community Edition"
              width="1024"
              height="1024"
              loading="lazy"
              class="layer-art"
            />
          </picture>
          <div>
            <h3>Community Edition</h3>
            <p>Local-first Oracle IDE</p>
            <span class="best-for">Best for: solo developers and local-first teams</span>
          </div>
        </div>
        <ul>
          <li>Full SQL / PL/SQL IDE</li>
          <li>Schema browser and debugger</li>
          <li>VRAS basic workflows</li>
          <li>Vector tools</li>
          <li>BYOK AI</li>
          <li>Apache 2.0 open source</li>
        </ul>
        <a href="/download" class="btn primary layer-btn">Download Free</a>
      </article>

      <article
        class="layer-card cloud"
        id="cloud"
        class:focused={activeLayer === "cloud"}
        class:unfocused={activeLayer === "community"}
      >
        <div class="layer-head">
          <picture class="layer-art-wrap">
            <source
              type="image/avif"
              srcset="/veesker-cloud-logo-320.avif 320w, /veesker-cloud-logo-640.avif 640w"
              sizes="(max-width: 980px) 90px, 112px"
            />
            <source
              type="image/webp"
              srcset="/veesker-cloud-logo-320.webp 320w, /veesker-cloud-logo-640.webp 640w"
              sizes="(max-width: 980px) 90px, 112px"
            />
            <img
              src="/veesker-cloud-logo.png"
              alt="Veesker Cloud"
              width="1536"
              height="1024"
              loading="lazy"
              class="layer-art"
            />
          </picture>
          <div>
            <h3>Veesker Cloud</h3>
            <p>AI intelligence layer for Oracle teams</p>
            <span class="status">Beta</span>
            <span class="best-for">Best for: managed AI, automation, and multi-dev workflows</span>
          </div>
        </div>
        <ul>
          <li>Schema-aware AI</li>
          <li>Managed AI (no API key)</li>
          <li>AI-assisted execution</li>
          <li>Optimization engine</li>
          <li>Intelligent automation</li>
          <li>Team workflows with usage and billing</li>
        </ul>
        <a href="/pricing#cloud" class="btn cloud layer-btn">Join Cloud Beta</a>
      </article>
    </div>
  </div>
</section>

<section class="security" aria-labelledby="security-title">
  <div class="container security-inner">
    <h2 id="security-title">Your database stays local.</h2>
    <p class="security-lead">
      Credentials, connections, and database access remain local to your machine.
      Cloud is opt-in and only powers managed intelligence workflows.
    </p>

    <div class="zones">
      <article class="zone local-zone">
        <h3>Local Zone</h3>
        <div class="architecture-row">
          <div class="node db">Oracle Database</div>
          <div class="arrow">-&gt;</div>
          <div class="node desktop">Veesker Desktop</div>
        </div>
        <ul class="guarantees">
          <li>Credentials remain local</li>
          <li>Connections stay on your machine</li>
        </ul>
      </article>

      <article class="zone cloud-zone">
        <h3>Optional Cloud Zone</h3>
        <div class="architecture-row">
          <div class="node desktop">Veesker Desktop</div>
          <div class="arrow optional">-&gt; optional</div>
          <div class="node cloud">Veesker Cloud AI</div>
        </div>
        <ul class="guarantees">
          <li>Managed intelligence and optimization</li>
          <li>Team workflows and usage visibility</li>
        </ul>
      </article>
    </div>
  </div>
</section>

<section class="proof">
  <div class="container proof-inner">
    <h2>Open source core. Optional managed intelligence.</h2>
    <p class="lead">
      The Community IDE is fully open source under Apache 2.0.
      Veesker Cloud is an optional managed intelligence layer for advanced AI and collaborative workflows.
    </p>
    <div class="cta">
      <a href="/download" class="btn primary">Download Community</a>
      <a href="/pricing#cloud" class="btn cloud">See Cloud Beta</a>
      <a href="https://github.com/Veesker-Cloud/veesker" class="btn" target="_blank" rel="noopener">View Source</a>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: 96px 0 64px;
    text-align: center;
    position: relative;
    background:
      linear-gradient(rgba(10, 8, 6, 0.84), rgba(10, 8, 6, 0.95)),
      url("/workspace-overview.png") center top / cover no-repeat;
  }
  .hero-logo-wrap {
    display: block;
  }
  .hero-logo {
    width: min(300px, 72vw);
    height: auto;
    object-fit: cover;
    margin: 0 auto 20px;
    display: block;
    filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.42));
  }
  .badge {
    display: inline-block;
    padding: 5px 14px;
    border-radius: 100px;
    background: linear-gradient(120deg, rgba(179, 62, 31, 0.24), rgba(43, 180, 238, 0.2));
    border: 1px solid rgba(245, 241, 232, 0.18);
    color: #f7d7cb;
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    margin-bottom: 20px;
  }
  h1 {
    font-size: 56px;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin: 0 0 24px;
  }
  .lead {
    font-size: 18px;
    line-height: 1.6;
    color: var(--text-muted);
    max-width: 780px;
    margin: 0 auto 24px;
  }
  .hero-chips {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 22px;
  }
  .hero-chips span {
    font-size: 12px;
    letter-spacing: 0.02em;
    padding: 6px 12px;
    border-radius: 100px;
    border: 1px solid rgba(245, 241, 232, 0.2);
    background: rgba(16, 15, 13, 0.6);
    color: #ece4d8;
  }
  .cta {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .signals {
    margin-top: 28px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    padding: 10px;
    border-radius: 12px;
    border: 1px solid rgba(245, 241, 232, 0.18);
    background: rgba(8, 8, 8, 0.8);
    backdrop-filter: blur(2px);
  }
  .signal {
    border: 1px solid rgba(245, 241, 232, 0.26);
    border-radius: 10px;
    padding: 11px 12px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(245, 241, 232, 0.96);
    background: rgba(20, 18, 16, 0.76);
  }

  .features {
    padding: 80px 0;
  }
  .features h2 {
    text-align: center;
    font-size: 34px;
    max-width: 860px;
    margin: 0 auto 38px;
  }
  .feat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .feat {
    background: linear-gradient(170deg, rgba(33, 28, 22, 0.95), rgba(24, 20, 16, 0.95));
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
  }
  .feat .ico {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--accent-text);
    margin-bottom: 12px;
  }
  .feat h3 {
    font-size: 18px;
    margin: 0 0 10px;
  }
  .feat p {
    color: var(--text-muted);
    font-size: 13.5px;
    line-height: 1.6;
    margin: 0;
  }

  .platform {
    padding: 0 0 82px;
  }
  .platform h2 {
    text-align: center;
    font-size: 34px;
    margin-bottom: 12px;
  }
  .platform-lead {
    text-align: center;
    color: var(--text-muted);
    font-size: 16px;
    line-height: 1.6;
    max-width: 700px;
    margin: 0 auto 34px;
  }
  .layer-focus-note {
    text-align: center;
    margin: 0 auto 18px;
    color: rgba(245, 241, 232, 0.78);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .layer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    align-items: stretch;
  }
  .layer-card {
    border-radius: 14px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    border: 1px solid var(--border);
    transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  }
  .layer-card.community {
    background: linear-gradient(160deg, rgba(179, 62, 31, 0.12), rgba(179, 62, 31, 0.03));
    border-color: rgba(245, 160, 138, 0.25);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
  .layer-card.cloud {
    background:
      radial-gradient(120% 100% at 10% 0%, rgba(43, 180, 238, 0.2), transparent 50%),
      linear-gradient(165deg, rgba(22, 29, 36, 0.96), rgba(16, 22, 29, 0.97));
    border-color: rgba(138, 216, 251, 0.34);
    box-shadow: 0 14px 36px rgba(13, 74, 100, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  .layer-card.focused {
    transform: translateY(-4px);
  }
  .layer-card.community.focused {
    box-shadow: 0 18px 34px rgba(79, 28, 13, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.09);
  }
  .layer-card.cloud.focused {
    box-shadow: 0 18px 38px rgba(11, 76, 104, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.11);
  }
  .layer-card.unfocused {
    opacity: 0.58;
    filter: saturate(0.75);
  }
  .layer-head {
    display: grid;
    grid-template-columns: 112px 1fr;
    gap: 14px;
    align-items: center;
  }
  .layer-art-wrap {
    display: block;
  }
  .layer-art {
    width: 112px;
    height: 86px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(8, 8, 8, 0.4);
  }
  .layer-card.community h3 {
    font-size: 24px;
    color: #f7b49f;
    margin-bottom: 3px;
  }
  .layer-card.cloud h3 {
    font-size: 24px;
    color: #9ce2ff;
    margin-bottom: 3px;
  }
  .layer-head p {
    margin: 0;
    color: var(--text-muted);
    font-size: 13.5px;
  }
  .best-for {
    display: block;
    margin-top: 7px;
    font-size: 11px;
    color: rgba(245, 241, 232, 0.7);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .status {
    display: inline-flex;
    align-items: center;
    margin-top: 8px;
    padding: 3px 9px;
    border-radius: 100px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
    color: #b9ebff;
    background: rgba(27, 158, 216, 0.2);
    border: 1px solid rgba(138, 216, 251, 0.45);
  }
  .layer-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
  }
  .layer-card li {
    padding: 8px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(245, 241, 232, 0.84);
    font-size: 14px;
  }
  .layer-card li:first-child {
    border-top: none;
  }
  .layer-card.community li::before {
    content: "+ ";
    color: var(--accent-text);
  }
  .layer-card.cloud li::before {
    content: "+ ";
    color: var(--cloud-text);
  }
  .layer-btn {
    width: 100%;
    justify-content: center;
  }

  .security {
    padding: 78px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background:
      radial-gradient(100% 130% at 80% 0%, rgba(43, 180, 238, 0.12), transparent 58%),
      linear-gradient(180deg, rgba(22, 19, 15, 0.95), rgba(14, 12, 10, 0.97));
  }
  .security-inner {
    text-align: center;
  }
  .security h2 {
    font-size: 34px;
    margin-bottom: 14px;
  }
  .security-lead {
    max-width: 820px;
    margin: 0 auto 30px;
    color: var(--text-muted);
    font-size: 16px;
    line-height: 1.7;
  }
  .zones {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .zone {
    border-radius: 12px;
    border: 1px solid var(--border-strong);
    padding: 20px;
    text-align: left;
    background: rgba(10, 10, 10, 0.32);
  }
  .zone h3 {
    font-size: 18px;
    margin-bottom: 12px;
  }
  .cloud-zone h3 {
    color: #9ce2ff;
  }
  .architecture-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 10px;
    align-items: center;
  }
  .node {
    border-radius: 10px;
    padding: 13px;
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid var(--border-strong);
    text-align: center;
  }
  .node.db {
    background: rgba(245, 160, 138, 0.08);
    color: #f7bda9;
  }
  .node.desktop {
    background: rgba(245, 241, 232, 0.06);
    color: #f5f1e8;
  }
  .node.cloud {
    background: rgba(43, 180, 238, 0.12);
    border-color: rgba(138, 216, 251, 0.4);
    color: #a9e6ff;
  }
  .arrow {
    color: rgba(245, 241, 232, 0.65);
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    white-space: nowrap;
  }
  .arrow.optional {
    color: #9cdfff;
  }
  .guarantees {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
  }
  .guarantees li {
    padding: 6px 0;
    font-size: 13px;
    color: rgba(245, 241, 232, 0.82);
  }
  .guarantees li::before {
    content: "* ";
    color: var(--cloud-text);
  }

  .proof {
    padding: 80px 0;
    text-align: center;
  }
  .proof h2 {
    font-size: 34px;
    margin-bottom: 14px;
  }
  .proof .lead {
    max-width: 760px;
  }

  @media (max-width: 980px) {
    h1 {
      font-size: 44px;
    }
    .signals {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .feat-grid,
    .layer-grid,
    .zones {
      grid-template-columns: 1fr;
    }
    .layer-head {
      grid-template-columns: 90px 1fr;
    }
    .layer-art {
      width: 90px;
      height: 70px;
    }
    .architecture-row {
      grid-template-columns: 1fr;
    }
    .arrow {
      text-align: center;
    }
  }

  @media (max-width: 600px) {
    .hero {
      padding-top: 82px;
    }
    h1 {
      font-size: 36px;
    }
    .lead {
      font-size: 16px;
    }
    .hero-logo {
      width: min(250px, 78vw);
    }
    .hero-chips span,
    .signal {
      font-size: 11.5px;
    }
    .features h2,
    .platform h2,
    .security h2,
    .proof h2 {
      font-size: 30px;
    }
  }
</style>
