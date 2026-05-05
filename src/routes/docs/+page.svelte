<script lang="ts">
  import Seo from "$lib/seo.svelte";
  import ScrollReveal from "$lib/components/ScrollReveal.svelte";
</script>

<Seo
  title="Docs"
  description="Veesker documentation — getting started, SQL editor, PL/SQL debugger, AI assistant, vector search, REST API builder. Hosted on GitHub alongside the source code."
  path="/docs"
/>

<ScrollReveal>
  <section class="hero">
    <div class="container">
      <h1>Documentation</h1>
      <p class="lead">All docs live in the public GitHub repository alongside the code.</p>

      <div class="docs">
      <a class="doc" href="https://github.com/veesker-cloud/veesker-community-edition/blob/main/README.md" target="_blank" rel="noopener">
        <h3>README →</h3>
        <p>Project overview, features, install, build instructions.</p>
      </a>
      <a class="doc" href="https://github.com/veesker-cloud/veesker-community-edition/blob/main/CLAUDE.md" target="_blank" rel="noopener">
        <h3>Development setup →</h3>
        <p>Windows + macOS prerequisites, build commands, troubleshooting.</p>
      </a>
      <a class="doc" href="https://github.com/veesker-cloud/veesker-community-edition/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener">
        <h3>Contributing →</h3>
        <p>How to set up dev env, code conventions, PR workflow.</p>
      </a>
      <a class="doc" href="https://github.com/veesker-cloud/veesker-community-edition/blob/main/COMMERCIAL_USE.md" target="_blank" rel="noopener">
        <h3>Commercial use →</h3>
        <p>Eligibility for free use, when subscription is required.</p>
      </a>
      <a class="doc" href="https://github.com/veesker-cloud/veesker-community-edition/blob/main/TERMS_OF_USE.md" target="_blank" rel="noopener">
        <h3>Terms of use →</h3>
        <p>Warranty disclaimer, liability limitation, user responsibilities.</p>
      </a>
      <a class="doc" href="https://github.com/veesker-cloud/veesker-community-edition/blob/main/SECURITY.md" target="_blank" rel="noopener">
        <h3>Security →</h3>
        <p>Vulnerability reporting policy, scope, supported versions.</p>
      </a>
      <a class="doc" href="https://github.com/veesker-cloud/veesker-community-edition/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noopener">
        <h3>Code of Conduct →</h3>
        <p>Contributor Covenant 2.1.</p>
      </a>
      <a class="doc" href="https://github.com/veesker-cloud/veesker-community-edition/blob/main/docs/AUTO_UPDATE.md" target="_blank" rel="noopener">
        <h3>Auto-update →</h3>
        <p>How the Tauri updater works + release process.</p>
      </a>
      <a class="doc" href="https://github.com/veesker-cloud/veesker-community-edition/blob/main/docs/ENTERPRISE.md" target="_blank" rel="noopener">
        <h3>Enterprise strategy →</h3>
        <p>Open core boundary, SaaS architecture, paid add-on roadmap.</p>
      </a>
      </div>
    </div>
  </section>
</ScrollReveal>

<style>
  .hero { padding: 80px 0; }
  h1 { font-size: 48px; margin-bottom: 16px; }
  .lead { color: var(--text-muted); font-size: 16px; margin-bottom: 36px; }
  .docs {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
  }
  .doc {
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 10px; padding: 22px;
    text-decoration: none; color: var(--text);
    transition: border-color 0.12s, transform 0.12s;
  }
  .doc:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    text-decoration: none;
  }
  .doc h3 { font-size: 16px; margin: 0 0 8px; color: var(--accent-text); }
  .doc p { color: var(--text-muted); font-size: 13.5px; margin: 0; line-height: 1.5; }

  @media (max-width: 880px) {
    .docs { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 600px) {
    .docs { grid-template-columns: 1fr; }
  }
</style>
