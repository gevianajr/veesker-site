<script lang="ts">
  import Seo from "$lib/seo.svelte";
</script>

<Seo
  title="Features"
  description="Community Edition covers full local-first Oracle workflows. Veesker Cloud is coming soon as an optional managed intelligence layer for schema-aware AI and team operations."
  path="/features"
  image="/workspace-overview.png"
  imageAlt="Veesker workspace — SQL editor, schema browser, results grid, AI assistant"
/>

<section class="hero">
  <div class="container">
    <h1>Features</h1>
    <p class="lead">
      Community Edition stays free under Apache 2.0. <a href="/pricing#cloud">Veesker Cloud (Coming Soon — H2 2026)</a>
      is the optional managed intelligence layer for deeper AI workflows.
    </p>
  </div>
</section>

<section class="content">
  <div class="container">
    <div class="feat-block">
      <h2>Community core workflows</h2>
      <ul>
        <li><strong>Full SQL and PL/SQL IDE</strong> — multi-statement execution with per-statement results.</li>
        <li><strong>Schema browser</strong> — dependency context and fast object navigation across large Oracle schemas.</li>
        <li><strong>PL/SQL debugger</strong> — breakpoints, watches, call stack, DBMS_OUTPUT capture, and cursor extraction.</li>
        <li><strong>VRAS — Veesker REST API Studio</strong> — practical ORDS endpoint workflows integrated into the editor.</li>
        <li><strong>Vector tooling</strong> — embeddings, index tuning, and similarity workflows on Oracle 23ai+.</li>
        <li><strong>Audit and safety controls</strong> — per-connection read-only / timeout / unsafe-DML guards for production-sensitive environments.</li>
      </ul>
    </div>

    <div class="feat-block">
      <h2>AI in Community — BYOK (Bring Your Own Key)</h2>
      <ul>
        <li><strong>Explain SQL</strong> — plain-language guidance for unfamiliar queries and execution plans.</li>
        <li><strong>Generate SQL</strong> — turn intent prompts into PL/SQL or DDL, refine inline in the editor.</li>
        <li><strong>Bring your own key</strong> — OpenAI, Anthropic, or local model. You control billing and provider trust.</li>
        <li><strong>No forced managed plan</strong> — Community stays complete and usable on its own.</li>
      </ul>
    </div>

    <div class="feat-block cloud-block" id="cloud">
      <h2>Cloud intelligence layer (Coming Soon — H2 2026)</h2>
      <ul>
        <li><strong>Schema-aware AI</strong> — grounded in your actual Oracle DDL, not generic SQL training data. Catches dialect quirks (CONNECT BY, MERGE, hints) that other tools miss.</li>
        <li><strong>Managed AI</strong> — no API keys to provision per developer. SSO + central billing.</li>
        <li><strong>Auto-tune queries</strong> — feeds EXPLAIN PLAN back to the model and suggests rewrites measured against real cost estimates, not heuristics.</li>
        <li><strong>Auto-document overnight</strong> — runs across packages and procedures, generates JavaDoc-style headers, flags undocumented parameters.</li>
        <li><strong>VeeskerDB Sandbox</strong> — share masked production extracts safely with team members. End-to-end encrypted, queryable as DuckDB.</li>
        <li><strong>Team workflows</strong> — shared snippets, audit log, usage and billing visibility per developer.</li>
      </ul>
    </div>

    <div class="feat-block">
      <h2>Local-first trust model</h2>
      <ul>
        <li><strong>Credentials stay local</strong> — keychain integration on macOS, DPAPI on Windows, Secret Service on Linux.</li>
        <li><strong>Database access remains local</strong> — Oracle connections never leave your desktop.</li>
        <li><strong>Cloud is optional</strong> — activated only when your team chooses managed intelligence.</li>
        <li><strong>Open-source core</strong> — Apache 2.0 codebase audited continuously via CodeQL and Dependabot.</li>
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
