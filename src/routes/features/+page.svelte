<script lang="ts">
  import Seo from "$lib/seo.svelte";
</script>

<Seo
  title="Features"
  description="Community Edition covers full local-first Oracle workflows. Veesker Cloud Beta adds optional managed intelligence for schema-aware AI and team operations."
  path="/features"
/>

<section class="hero">
  <div class="container">
    <h1>Features</h1>
    <p class="lead">
      Community Edition remains free under Apache 2.0. <a href="/pricing#cloud">Veesker Cloud Beta</a>
      is the optional managed intelligence layer for deeper AI workflows.
    </p>
  </div>
</section>

<section class="content">
  <div class="container">
    <div class="feat-block">
      <h2>Community core workflows</h2>
      <ul>
        <li><strong>Full SQL and PL/SQL IDE</strong> with multi-statement execution and per-statement results.</li>
        <li><strong>Schema browser</strong> with dependency context and fast object navigation.</li>
        <li><strong>PL/SQL debugger</strong> with breakpoints, watches, call stack, and output capture.</li>
        <li><strong>VRAS basics</strong> for practical ORDS endpoint workflows.</li>
        <li><strong>Vector tooling</strong> for embeddings and similarity operations.</li>
        <li><strong>Audit and safety controls</strong> for production-sensitive environments.</li>
      </ul>
    </div>

    <div class="feat-block">
      <h2>AI in Community (BYOK)</h2>
      <ul>
        <li><strong>Explain SQL</strong> with plain-language guidance for faster query understanding.</li>
        <li><strong>Generate SQL</strong> from intent prompts and refine inside your local IDE.</li>
        <li><strong>Bring your own key</strong> so model access remains under your control.</li>
        <li><strong>No forced managed plan</strong> to keep Community complete and usable by itself.</li>
      </ul>
    </div>

    <div class="feat-block cloud-block" id="cloud">
      <h2>Cloud Beta intelligence layer</h2>
      <ul>
        <li><strong>Schema-aware AI</strong> grounded in your Oracle structures and operational context.</li>
        <li><strong>Managed AI</strong> with no API key handling inside developer workflows.</li>
        <li><strong>AI-assisted execution</strong> and optimization recommendations for complex workloads.</li>
        <li><strong>Intelligent automation</strong> for recurring analysis and team operations.</li>
        <li><strong>Team features</strong> for shared context and collaborative delivery.</li>
        <li><strong>Usage and billing visibility</strong> for managed intelligence adoption.</li>
      </ul>
    </div>

    <div class="feat-block">
      <h2>Local-first trust model</h2>
      <ul>
        <li><strong>Credentials stay local</strong> in desktop workflows.</li>
        <li><strong>Database access remains local</strong> by default.</li>
        <li><strong>Cloud is optional</strong> and activated only when your team chooses managed intelligence.</li>
      </ul>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: 80px 0 30px;
    text-align: center;
  }
  h1 {
    font-size: 48px;
    margin-bottom: 16px;
  }
  .lead {
    color: var(--text-muted);
    font-size: 16px;
    line-height: 1.6;
    max-width: 740px;
    margin: 0 auto;
  }
  .content {
    padding: 30px 0 80px;
  }
  .feat-block {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px;
    margin-bottom: 18px;
  }
  .feat-block h2 {
    font-size: 24px;
    margin: 0 0 18px;
    color: var(--accent-text);
  }
  .feat-block ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .feat-block li {
    padding: 10px 0;
    border-top: 1px dashed var(--border);
    font-size: 14.5px;
    line-height: 1.6;
    color: var(--text-muted);
  }
  .feat-block li:first-child {
    border-top: none;
  }
  .feat-block li strong {
    color: var(--text);
  }

  .cloud-block {
    background:
      radial-gradient(130% 120% at 10% 0%, rgba(43, 180, 238, 0.22), transparent 50%),
      linear-gradient(165deg, rgba(24, 30, 36, 0.96), rgba(18, 23, 29, 0.97));
    border-color: rgba(138, 216, 251, 0.35);
    box-shadow: 0 10px 28px rgba(13, 74, 100, 0.23);
  }
  .cloud-block h2 {
    color: var(--cloud-text);
  }

  @media (max-width: 820px) {
    h1 {
      font-size: 36px;
    }
  }
</style>
