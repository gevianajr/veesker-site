<script lang="ts">
  import Seo from "$lib/seo.svelte";
</script>

<Seo
  title="Pricing"
  description="Veesker is free for all uses during early access. Commercial subscriptions coming — same code, same features, no kill-switch. Contact for early access."
  path="/pricing"
/>

<section class="hero">
  <div class="container">
    <h1>Pricing</h1>
    <p class="lead">
      The Veesker source code is fully open under Apache 2.0 — for everyone, forever, with no feature gating.
    </p>
  </div>
</section>

<section class="early-access">
  <div class="container">
    <div class="ea-card">
      <div class="ea-badge">Early access</div>
      <h2>Currently: free for all uses</h2>
      <p>
        Veesker is in early access. Until commercial subscriptions launch, the packaged app is
        free for all uses — personal, open source, education, and commercial.
      </p>
      <a href="/download" class="btn primary">Download free →</a>
    </div>
  </div>
</section>

<section class="coming-soon">
  <div class="container">
    <h2>Coming soon: commercial subscriptions</h2>
    <p class="lead">
      In the spirit of Docker Desktop, larger organizations will support continued development
      through a paid subscription for the packaged app + commercial-grade support.
    </p>

    <div class="tiers">
      <div class="tier">
        <h3>Personal</h3>
        <div class="tier-tag">Free forever</div>
        <p>For individuals, OSS contributors, and small organizations (≤50 employees AND ≤US$ 5M revenue).</p>
      </div>
      <div class="tier">
        <h3>Pro</h3>
        <div class="tier-tag">For individual professionals</div>
        <p>Commercial use right + email support for freelancers and consultants.</p>
      </div>
      <div class="tier highlight">
        <h3>Business</h3>
        <div class="tier-tag">For teams</div>
        <p>Veesker Cloud (when available), faster support, team features.</p>
      </div>
      <div class="tier">
        <h3>Enterprise</h3>
        <div class="tier-tag">For regulated industries</div>
        <p>SSO, indemnification, dedicated support, on-prem options.</p>
      </div>
    </div>
    <p class="note">Pricing will be in USD. Billing is not yet active.</p>
  </div>
</section>

<section class="early-customers">
  <div class="container narrow">
    <h2>Want early access to commercial support?</h2>
    <p>
      If your organization wants to support development now or be among the first commercial
      customers, reach out directly.
    </p>
    <p>We are particularly interested in hearing from:</p>
    <ul>
      <li>Companies running Oracle 23ai with vector search needs</li>
      <li>Active open-source maintainers (free Pro license available once subscriptions launch)</li>
      <li>Public sector and education (discount on commercial tiers when launched)</li>
    </ul>
    <a href="/contact" class="btn primary">Contact us →</a>
  </div>
</section>

<section class="addons">
  <div class="container">
    <h2>Add-ons (planned)</h2>
    <p class="lead">
      Niche-deep paid plugins for specific use cases, available à la carte once commercial
      billing launches.
    </p>
    <div class="addon-grid">
      <div class="addon">
        <h3>Oracle EBS Pack</h3>
        <p>GL/AP integration templates, Forms converter</p>
      </div>
      <div class="addon">
        <h3>AWR Analyzer</h3>
        <p>Performance regression detection from AWR/Statspack data</p>
      </div>
      <div class="addon">
        <h3>Compliance Pack BR</h3>
        <p>LGPD / BACEN-ready audit reports</p>
      </div>
      <div class="addon">
        <h3>Azure OpenAI / AWS Bedrock</h3>
        <p>Bring your own cloud LLM for Veesker AI</p>
      </div>
      <div class="addon">
        <h3>On-prem LLM gateway</h3>
        <p>Llama / Mistral via Ollama, fully local</p>
      </div>
      <div class="addon">
        <h3>Audit Log Shipper</h3>
        <p>Splunk / Datadog / S3 destinations</p>
      </div>
    </div>
    <p class="note"><a href="/contact?subject=Add-ons">Express interest →</a></p>
  </div>
</section>

<section class="faq">
  <div class="container">
    <h2>Frequently asked</h2>
    <div class="faq-grid">
      <div>
        <h3>Are paid features hidden in the source?</h3>
        <p>
          No. Every feature lives in the open-source repo, and every tier uses the exact same
          codebase. A subscription, when available, gives you the right to use the packaged app
          commercially + support + (in higher tiers) Veesker Cloud — never extra source-level features.
        </p>
      </div>
      <div>
        <h3>Will Veesker have a kill-switch?</h3>
        <p>
          No. The app keeps working regardless. Compliance, when commercial plans launch, will be
          contractual and honor-based — same model as Docker Desktop.
        </p>
      </div>
      <div>
        <h3>Can I self-host Veesker Cloud?</h3>
        <p>
          When Veesker Cloud launches, the Enterprise tier will support self-hosted deployment.
          Business will use the managed cloud only.
        </p>
      </div>
      <div>
        <h3>Are open-source maintainers eligible for free Pro?</h3>
        <p>
          Yes. If you maintain a public OSS project (≥6 months active, ≥50 stars or equivalent),
          you will qualify for a free Pro license once subscriptions launch.
          <a href="/contact?subject=OSS license">Apply here</a>.
        </p>
      </div>
      <div>
        <h3>Government / education discount?</h3>
        <p>
          Discounted Business and Enterprise tiers are planned for public sector,
          federal/state universities, and registered NGOs.
        </p>
      </div>
      <div>
        <h3>We are a 30-person company. Do we need to pay?</h3>
        <p>
          No. Personal tier covers up to 50 employees AND less than US$ 5M revenue. And during
          early access, everyone can use Veesker free regardless of size.
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
    max-width: 720px;
    margin: 0 auto;
  }

  /* Early access card */
  .early-access { padding: 20px 0 60px; }
  .ea-card {
    background: linear-gradient(135deg, rgba(179,62,31,0.12), rgba(179,62,31,0.04));
    border: 1px solid rgba(179,62,31,0.4);
    border-radius: 14px;
    padding: 40px 48px;
    text-align: center;
    max-width: 680px;
    margin: 0 auto;
  }
  .ea-badge {
    display: inline-block;
    background: var(--accent);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    margin-bottom: 18px;
  }
  .ea-card h2 { font-size: 28px; margin: 0 0 14px; }
  .ea-card p { color: var(--text-muted); font-size: 15px; line-height: 1.65; margin: 0 0 24px; }

  /* Coming soon tiers */
  .coming-soon { padding: 0 0 60px; }
  .coming-soon h2 { font-size: 32px; text-align: center; margin-bottom: 14px; }
  .coming-soon > .container > .lead { text-align: center; margin-bottom: 36px; }
  .tiers {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 18px;
  }
  .tier {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px 20px;
  }
  .tier.highlight {
    border-color: rgba(179,62,31,0.4);
    background: linear-gradient(180deg, rgba(179,62,31,0.08), var(--bg-soft));
  }
  .tier h3 { font-size: 18px; margin: 0 0 8px; }
  .tier-tag {
    font-size: 11px;
    color: var(--accent-text);
    font-weight: 600;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .tier p { color: var(--text-muted); font-size: 13px; line-height: 1.55; margin: 0; }
  .note {
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
    margin-top: 10px;
  }
  .note a { color: var(--accent-text); }

  /* Early customers */
  .early-customers { padding: 20px 0 60px; }
  .narrow { max-width: 680px; }
  .early-customers h2 { font-size: 28px; margin-bottom: 14px; }
  .early-customers p { color: var(--text-muted); font-size: 14.5px; line-height: 1.65; margin: 0 0 14px; }
  .early-customers ul {
    list-style: none; padding: 0; margin: 0 0 24px;
  }
  .early-customers li {
    padding: 6px 0;
    font-size: 14px;
    color: var(--text-muted);
    border-top: 1px dashed var(--border);
  }
  .early-customers li:first-child { border-top: none; }
  .early-customers li::before { content: "→"; color: var(--accent-text); margin-right: 8px; }

  /* Add-ons */
  .addons { padding: 0 0 80px; }
  .addons h2 { font-size: 32px; text-align: center; margin-bottom: 14px; }
  .addons .lead { text-align: center; margin-bottom: 36px; }
  .addon-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
    margin-bottom: 18px;
  }
  .addon {
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 10px; padding: 20px;
  }
  .addon h3 { font-size: 15px; margin: 0 0 8px; }
  .addon p { color: var(--text-muted); font-size: 13px; margin: 0; line-height: 1.5; }

  /* FAQ */
  .faq { padding: 0 0 80px; }
  .faq h2 { font-size: 32px; margin-bottom: 30px; text-align: center; }
  .faq-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 28px;
  }
  .faq h3 { font-size: 16px; margin: 0 0 8px; }
  .faq p { color: var(--text-muted); font-size: 13.5px; line-height: 1.6; margin: 0; }
  .faq a { color: var(--accent-text); }

  @media (max-width: 980px) {
    .tiers { grid-template-columns: 1fr 1fr; }
    .addon-grid { grid-template-columns: 1fr 1fr; }
    .faq-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .tiers, .addon-grid { grid-template-columns: 1fr; }
    h1 { font-size: 36px; }
    .ea-card { padding: 28px 22px; }
  }
</style>
