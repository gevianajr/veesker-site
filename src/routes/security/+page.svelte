<script lang="ts">
  import Seo from "$lib/seo.svelte";
  import ScrollReveal from "$lib/components/ScrollReveal.svelte";
</script>

<Seo
  title="Security"
  description="Veesker is local-first by design. Database credentials never leave your machine, the source is open under Apache 2.0, every release is signed, and the codebase is continuously audited via CodeQL and Dependabot."
  path="/security"
  image="/datamap-hero.png"
  imageAlt="Veesker security architecture — Desktop Client → API → Oracle, with encrypted Sandbox path"
/>

<ScrollReveal>
  <section class="hero">
    <div class="container">
      <div class="eyebrow">Trust model</div>
      <h1>Security at Veesker.</h1>
      <p class="lead">
        Local-first by design. Open-source by default. Continuously audited.
        Here is exactly how Veesker handles your data, your credentials, and your code.
      </p>
    </div>
  </section>
</ScrollReveal>

<ScrollReveal>
  <section class="pillars">
    <div class="container">
      <div class="pillar-grid">
      <article class="pillar">
        <div class="pillar-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2 4 6v6c0 4.4 3.4 8.5 8 10 4.6-1.5 8-5.6 8-10V6z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <h2>Local-first by design</h2>
        <ul>
          <li>Oracle credentials live in OS keychains: Keychain on macOS, DPAPI on Windows, Secret Service on Linux.</li>
          <li>Database connections never leave your desktop install.</li>
          <li>Cloud features are strictly opt-in. The IDE works fully offline.</li>
        </ul>
      </article>

      <article class="pillar">
        <div class="pillar-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z"/>
            <circle cx="6" cy="5" r="0.6" fill="currentColor"/>
            <circle cx="6" cy="12" r="0.6" fill="currentColor"/>
            <circle cx="6" cy="19" r="0.6" fill="currentColor"/>
          </svg>
        </div>
        <h2>Open source you can audit</h2>
        <ul>
          <li>Community Edition is Apache 2.0, source on <a href="https://github.com/veesker-cloud/veesker-community-edition" target="_blank" rel="noopener">GitHub</a>.</li>
          <li>Every dependency change is reviewed via Dependabot before merge.</li>
          <li>Static analysis runs on every PR via CodeQL — JS, TS, Rust paths.</li>
          <li>OSV-Scanner monitors transitive vulns weekly.</li>
        </ul>
      </article>

      <article class="pillar">
        <div class="pillar-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="10" width="16" height="11" rx="2"/>
            <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
          </svg>
        </div>
        <h2>Per-connection safety guards</h2>
        <ul>
          <li><strong>Environment-aware:</strong> dev / staging / prod tags drive UI affordances and confirm gates.</li>
          <li><strong>Read-only mode:</strong> blocks DML/DDL on connections marked read-only.</li>
          <li><strong>Statement timeouts:</strong> per-connection cap prevents runaway queries.</li>
          <li><strong>Unsafe-DML confirmations:</strong> bare DELETE/UPDATE without WHERE require explicit re-confirmation.</li>
        </ul>
      </article>

      <article class="pillar">
        <div class="pillar-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4M12 18v4M3 12h3M18 12h3"/>
            <circle cx="12" cy="12" r="6"/>
            <path d="m15 9-6 6M9 9l6 6"/>
          </svg>
        </div>
        <h2>Signed releases &amp; auto-update</h2>
        <ul>
          <li>Every release is signed with Ed25519 before publication.</li>
          <li>The auto-updater verifies signatures on launch — tampered binaries fail closed.</li>
          <li>Windows installer code-signing via Azure Trusted Signing — Microsoft Identity Validation in progress (Coming Soon).</li>
          <li>SHA-256 checksums published with each release for manual verification.</li>
        </ul>
      </article>
    </div>
  </div>
</section>
</ScrollReveal>

<ScrollReveal>
  <section class="sandbox-zone" aria-labelledby="sandbox-zone-title">
    <div class="container">
    <h2 id="sandbox-zone-title">VeeskerDB Sandbox — encryption details.</h2>
    <p class="zone-lead">
      When the optional Cloud Sandbox is used, the data flow is engineered so Veesker servers never see plaintext.
    </p>
    <div class="zone-grid">
      <div class="zone-card">
        <h3>End-to-end encryption</h3>
        <p>X25519 envelopes per recipient. ChaCha20-Poly1305 for content. Key derivation via HKDF.</p>
      </div>
      <div class="zone-card">
        <h3>Server is a relay</h3>
        <p>Sandbox blobs upload to Cloudflare R2 with SHA-256 verification on retrieval. The API brokers sealed envelopes — never the plaintext.</p>
      </div>
      <div class="zone-card">
        <h3>Auto-PII masking</h3>
        <p>Emails, phone numbers, and identifier columns are auto-detected. Owner picks masking strategy — hash, redact, static, or partial — before encryption.</p>
      </div>
      <div class="zone-card">
        <h3>Replay defense + lookup throttling</h3>
        <p>Each pull validates a one-time nonce and rate-limits per recipient. Lookup endpoint is throttled to prevent enumeration.</p>
      </div>
    </div>
  </div>
</section>
</ScrollReveal>

<ScrollReveal>
  <section class="audits">
  <div class="container">
    <h2>Audit history</h2>
    <div class="audit-list">
      <article class="audit-item">
        <div class="audit-date">2026-05-02</div>
        <h3>Sandbox Plan 5b — review pass 2 (ultrathink)</h3>
        <p>
          Multi-agent security review of the Sandbox publish/pull flow. Hardened JWT identity in Rust + sidecar.
          R2 SHA verification, replay defense, lookup throttling. Cross-repo PRs merged.
        </p>
      </article>
      <article class="audit-item">
        <div class="audit-date">2026-04-30</div>
        <h3>Comprehensive security audit (16 findings)</h3>
        <p>
          16 findings across credential storage, SQL safety, audit logging, error reflection.
          All resolved across 4 batches + ultrareview pass. Migrations 004-006 hardened the auth/audit path.
        </p>
      </article>
      <article class="audit-item">
        <div class="audit-date">2026-04-26</div>
        <h3>Per-connection safety milestone</h3>
        <p>
          Shipped 4 per-connection safety guards: environment-aware (dev/staging/prod),
          read-only mode, statement timeouts, unsafe-DML confirmations. Plus Dependabot, CodeQL, OSV-Scanner CI.
        </p>
      </article>
    </div>
  </div>
</section>
</ScrollReveal>

<ScrollReveal>
  <section class="disclosure">
  <div class="container disclosure-inner">
    <h2>Responsible disclosure</h2>
    <p class="disclosure-lead">
      Found a vulnerability? Report it privately — we treat security reports as priority work.
    </p>
    <div class="disclosure-grid">
      <div>
        <h3>How to report</h3>
        <ul>
          <li>Email <a href="mailto:geraldovianajr@veesker.cloud?subject=%5BSECURITY%5D%20Vulnerability%20report"><code>geraldovianajr@veesker.cloud</code></a> with subject prefix <code>[SECURITY]</code>.</li>
          <li>Or open a <a href="https://github.com/veesker-cloud/veesker-community-edition/security/advisories/new" target="_blank" rel="noopener">GitHub private security advisory</a>.</li>
          <li>Include reproduction steps, affected version, and impact assessment.</li>
        </ul>
      </div>
      <div>
        <h3>Our commitment</h3>
        <ul>
          <li>Initial response within 2 business days.</li>
          <li>Coordinated disclosure window — typically 60-90 days from triage.</li>
          <li>Credit in the release notes (or anonymous if you prefer).</li>
          <li>No legal action against good-faith research.</li>
        </ul>
      </div>
    </div>
    <div class="disclosure-cta">
      <a href="https://github.com/veesker-cloud/veesker-community-edition/blob/main/SECURITY.md" target="_blank" rel="noopener" class="btn">Read full SECURITY.md</a>
      <a href="https://github.com/veesker-cloud/veesker-community-edition/security" target="_blank" rel="noopener" class="btn">View security advisories</a>
    </div>
  </div>
</section>
</ScrollReveal>

<style>
  .hero {
    padding: 80px 0 50px;
    text-align: center;
  }
  .eyebrow {
    display: inline-block;
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #9ce2ff;
    background: rgba(43, 180, 238, 0.12);
    border: 1px solid rgba(138, 216, 251, 0.32);
    border-radius: 100px;
    padding: 5px 14px;
    margin-bottom: 18px;
  }
  h1 {
    font-size: 48px;
    margin: 0 0 18px;
    letter-spacing: -0.02em;
  }
  .lead {
    color: var(--text-muted);
    font-size: 17px;
    line-height: 1.65;
    max-width: 740px;
    margin: 0 auto;
  }

  .pillars {
    padding: 30px 0 60px;
  }
  .pillar-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    max-width: 1080px;
    margin: 0 auto;
  }
  .pillar {
    background: linear-gradient(170deg, rgba(28, 24, 20, 0.92), rgba(20, 18, 15, 0.94));
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px;
  }
  .pillar-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(249, 115, 22, 0.12);
    border: 1px solid rgba(249, 115, 22, 0.32);
    color: #fdba74;
    margin-bottom: 16px;
  }
  .pillar-icon svg {
    width: 22px;
    height: 22px;
  }
  .pillar h2 {
    font-size: 21px;
    margin: 0 0 14px;
  }
  .pillar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .pillar li {
    padding: 8px 0;
    color: var(--text-muted);
    font-size: 13.5px;
    line-height: 1.6;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }
  .pillar li:first-child {
    border-top: none;
  }
  .pillar li strong {
    color: var(--text);
  }
  .pillar a {
    color: var(--accent-text);
  }

  .sandbox-zone {
    padding: 60px 0;
    background:
      radial-gradient(110% 90% at 80% 0%, rgba(43, 180, 238, 0.16), transparent 56%),
      linear-gradient(170deg, rgba(20, 27, 34, 0.96), rgba(13, 18, 24, 0.98));
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .sandbox-zone h2 {
    text-align: center;
    font-size: 30px;
    margin: 0 0 10px;
    color: #cfeeff;
  }
  .zone-lead {
    text-align: center;
    color: var(--text-muted);
    font-size: 15px;
    max-width: 640px;
    margin: 0 auto 28px;
    line-height: 1.6;
  }
  .zone-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    max-width: 920px;
    margin: 0 auto;
  }
  .zone-card {
    background: linear-gradient(170deg, rgba(28, 38, 48, 0.94), rgba(18, 26, 34, 0.95));
    border: 1px solid rgba(138, 216, 251, 0.28);
    border-radius: 10px;
    padding: 18px 20px;
  }
  .zone-card h3 {
    font-size: 15px;
    margin: 0 0 8px;
    color: #cfeeff;
  }
  .zone-card p {
    margin: 0;
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.6;
  }

  .audits {
    padding: 60px 0;
  }
  .audits h2 {
    text-align: center;
    font-size: 30px;
    margin: 0 0 32px;
  }
  .audit-list {
    max-width: 820px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .audit-item {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 10px;
    padding: 18px 22px;
  }
  .audit-date {
    font-family: "JetBrains Mono", monospace;
    font-size: 11.5px;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    margin-bottom: 6px;
  }
  .audit-item h3 {
    font-size: 17px;
    margin: 0 0 8px;
  }
  .audit-item p {
    color: var(--text-muted);
    font-size: 13.5px;
    line-height: 1.6;
    margin: 0;
  }

  .disclosure {
    padding: 60px 0 80px;
  }
  .disclosure-inner {
    max-width: 920px;
  }
  .disclosure h2 {
    font-size: 30px;
    margin: 0 0 10px;
    text-align: center;
  }
  .disclosure-lead {
    color: var(--text-muted);
    font-size: 15px;
    text-align: center;
    margin: 0 auto 32px;
    max-width: 640px;
    line-height: 1.6;
  }
  .disclosure-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  .disclosure-grid > div {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 22px;
  }
  .disclosure-grid h3 {
    font-size: 17px;
    margin: 0 0 12px;
  }
  .disclosure-grid ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .disclosure-grid li {
    padding: 8px 0;
    color: var(--text-muted);
    font-size: 13.5px;
    line-height: 1.6;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }
  .disclosure-grid li:first-child {
    border-top: none;
  }
  .disclosure-grid code {
    font-family: "JetBrains Mono", monospace;
    background: rgba(245, 241, 232, 0.08);
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 12px;
  }
  .disclosure-grid a {
    color: var(--accent-text);
  }
  .disclosure-cta {
    margin-top: 28px;
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  @media (max-width: 820px) {
    h1 {
      font-size: 36px;
    }
    .pillar-grid,
    .zone-grid,
    .disclosure-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
