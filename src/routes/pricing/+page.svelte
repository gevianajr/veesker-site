<script lang="ts">
  import Seo from "$lib/seo.svelte";
</script>

<Seo
  title="Pricing"
  description="Veesker Community Edition is free forever under Apache 2.0. Veesker Cloud — schema-aware AI, managed execution, team features — coming soon."
  path="/pricing"
/>

<section class="hero">
  <div class="container">
    <h1>Pricing</h1>
    <p class="lead">
      The IDE is free forever. Cloud is the optional premium layer with managed, schema-aware AI.
    </p>
  </div>
</section>

<section class="plans">
  <div class="container">
    <div class="plan-grid">

      <div class="plan ce">
        <div class="plan-head">
          <img src="/ce-logo.png" alt="" width="40" height="40" class="plan-logo" />
          <div>
            <span class="plan-name">Community Edition</span>
            <span class="plan-badge ce-badge">Free forever</span>
          </div>
        </div>
        <div class="plan-price">$0 <span class="plan-cycle">/ always</span></div>
        <p class="plan-desc">The full Oracle IDE — every core feature included, no expiry, no credit card, no commercial-use gate for individuals and small orgs.</p>
        <a href="/download" class="btn primary plan-btn">Download free →</a>
        <ul class="plan-features">
          <li>Multi-statement SQL editor</li>
          <li>PL/SQL debugger (breakpoints, watch, call stack)</li>
          <li>Schema browser + DataFlow graph</li>
          <li>ORDS / REST API Studio (VRAS)</li>
          <li>Vector search studio</li>
          <li>Terminal (PTY)</li>
          <li>Transaction management</li>
          <li>Query history + audit log</li>
          <li>Auto-update (Ed25519-signed)</li>
          <li>BYOK AI — explain &amp; generate SQL <span class="note">(Anthropic key required)</span></li>
          <li>Apache 2.0 — fork and self-host</li>
        </ul>
        <p class="plan-fine">
          Free for individuals, OSS contributors, students, and organizations with fewer than 50 employees and under US$ 5M revenue.
          See <a href="https://github.com/gevianajr/veesker/blob/main/COMMERCIAL_USE.md" target="_blank" rel="noopener">COMMERCIAL_USE.md</a> for larger organizations.
        </p>
      </div>

      <div class="plan cloud">
        <div class="plan-head">
          <span class="cloud-icon">☁</span>
          <div>
            <span class="plan-name">Veesker Cloud</span>
            <span class="plan-badge cloud-badge">Coming soon</span>
          </div>
        </div>
        <div class="plan-price">TBD <span class="plan-cycle">/ per seat / month</span></div>
        <p class="plan-desc">Managed AI that connects directly to your Oracle schema — schema-aware context, live query execution, no API key required.</p>
        <a href="/contact" class="btn plan-btn">Get notified →</a>
        <ul class="plan-features">
          <li>Everything in Community Edition</li>
          <li>Schema-aware AI — AI knows your tables, columns, PKs, FKs</li>
          <li>AI runs live SELECT queries for context</li>
          <li>Query optimization + performance analysis</li>
          <li>Procedure generation + debugging AI</li>
          <li>No API key required</li>
          <li>Team features + shared queries</li>
          <li>Usage dashboard + credit billing</li>
          <li>Vector Search Studio with embedding costs managed</li>
          <li>Priority support</li>
        </ul>
        <p class="plan-fine">
          Pricing will be announced closer to launch. Register interest at <a href="/contact">contact</a>.
        </p>
      </div>

    </div>
  </div>
</section>

<section class="faq">
  <div class="container">
    <h2>Frequently asked</h2>
    <div class="faq-grid">
      <div>
        <h3>Is CE really free forever?</h3>
        <p>
          Yes. The Community Edition is the full Oracle IDE — no features are hidden or time-limited.
          The code is Apache 2.0 on GitHub. You can fork it, self-host it, or compile it yourself — no gates.
        </p>
      </div>
      <div>
        <h3>What's the difference between CE AI and Cloud AI?</h3>
        <p>
          CE AI (BYOK) uses your Anthropic key and works as a text assistant: explain SQL and generate SQL.
          It does not access your database. Cloud AI connects to your live schema, runs SELECT queries
          for context, and gives schema-aware answers — no API key needed.
        </p>
      </div>
      <div>
        <h3>Will there be a kill-switch in CE?</h3>
        <p>
          No. The app keeps working regardless of any subscription status. Compliance is honor-based
          and contractual — same model as Docker Desktop.
        </p>
      </div>
      <div>
        <h3>Are paid features hidden in the source code?</h3>
        <p>
          No. Every CE feature is open-source. Cloud adds a hosted service (managed AI inference,
          schema indexing, team features) — not secret source code.
        </p>
      </div>
      <div>
        <h3>We are a 30-person company. Do we need to pay?</h3>
        <p>
          No. CE is free for organizations with fewer than 50 employees and less than US$ 5M revenue.
          Cloud is optional — it's about getting schema-aware AI, not access to the IDE.
        </p>
      </div>
      <div>
        <h3>OSS maintainers / education / government?</h3>
        <p>
          Free Cloud tier planned for active OSS maintainers (≥50 stars, ≥6 months active).
          Discounts for public sector and universities once Cloud billing launches.
          <a href="/contact?subject=Cloud early access">Contact us</a> to express interest.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .hero { padding: 80px 0 40px; text-align: center; }
  h1 { font-size: 48px; margin-bottom: 16px; }
  .lead {
    color: var(--text-muted);
    font-size: 16px;
    line-height: 1.6;
    max-width: 620px;
    margin: 0 auto;
  }

  .plans { padding: 20px 0 80px; }
  .plan-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    max-width: 940px;
    margin: 0 auto;
  }
  .plan {
    border-radius: 14px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .plan.ce {
    background: linear-gradient(160deg, rgba(126,201,106,0.07), rgba(126,201,106,0.02));
    border: 1px solid rgba(126,201,106,0.3);
  }
  .plan.cloud {
    background: linear-gradient(160deg, rgba(106,160,245,0.07), rgba(106,160,245,0.02));
    border: 1px solid rgba(106,160,245,0.3);
  }
  .plan-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .plan-logo { object-fit: contain; flex-shrink: 0; }
  .cloud-icon { font-size: 30px; width: 40px; text-align: center; flex-shrink: 0; }
  .plan-name {
    display: block;
    font-size: 17px;
    font-weight: 700;
  }
  .plan.ce .plan-name { color: #7ec96a; }
  .plan.cloud .plan-name { color: #6aa0f5; }
  .plan-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 2px 8px;
    border-radius: 100px;
    margin-top: 4px;
  }
  .ce-badge { background: rgba(126,201,106,0.15); color: #7ec96a; }
  .cloud-badge { background: rgba(106,160,245,0.15); color: #6aa0f5; }
  .plan-price {
    font-size: 36px;
    font-weight: 700;
    line-height: 1;
  }
  .plan-cycle {
    font-size: 13px;
    font-weight: 400;
    color: var(--text-muted);
  }
  .plan-desc {
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
  }
  .plan-btn { width: 100%; justify-content: center; }
  .plan-features {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .plan-features li {
    padding: 7px 0;
    font-size: 13.5px;
    color: var(--text-muted);
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .plan-features li:first-child { border-top: none; }
  .plan-features li::before { content: "✓ "; color: var(--accent-text); }
  .note { font-size: 11px; color: var(--text-muted); margin-left: 4px; }
  .plan-fine {
    font-size: 11.5px;
    color: var(--text-muted);
    margin: 0;
    line-height: 1.5;
  }
  .plan-fine a { color: var(--accent-text); }

  .faq { padding: 0 0 80px; }
  .faq h2 { font-size: 32px; margin-bottom: 30px; text-align: center; }
  .faq-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 28px;
    max-width: 940px; margin: 0 auto;
  }
  .faq h3 { font-size: 16px; margin: 0 0 8px; }
  .faq p { color: var(--text-muted); font-size: 13.5px; line-height: 1.6; margin: 0; }
  .faq a { color: var(--accent-text); }

  @media (max-width: 820px) {
    .plan-grid { grid-template-columns: 1fr; }
    .faq-grid { grid-template-columns: 1fr; }
    h1 { font-size: 36px; }
  }
</style>
