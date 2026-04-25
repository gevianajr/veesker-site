<script lang="ts">
  type Tier = {
    name: string;
    price: string;
    pricePeriod: string;
    description: string;
    features: string[];
    cta: { label: string; href: string };
    highlight?: boolean;
  };

  const tiers: Tier[] = [
    {
      name: "Personal",
      price: "Free",
      pricePeriod: "forever",
      description: "For individuals, OSS contributors, and small organizations (≤50 employees AND ≤US$ 5M revenue).",
      features: [
        "Veesker IDE — full feature set",
        "All open-source features",
        "AI Sheep (BYO API key)",
        "Vector search studio",
        "PL/SQL Debugger",
        "VRAS REST API Studio",
        "Auto-update & local audit log",
        "Best-effort support via GitHub issues",
      ],
      cta: { label: "Download free", href: "/download" },
    },
    {
      name: "Pro",
      price: "R$ 49",
      pricePeriod: "/ user / month",
      description: "Individual freelancers and consultants who use Veesker on commercial work.",
      features: [
        "Everything in Personal",
        "Commercial use right",
        "Email support · 5-business-day SLA",
        "Optional add-ons (à la carte)",
        "Priority bug-fix triage",
      ],
      cta: { label: "Subscribe", href: "/contact?subject=Pro" },
    },
    {
      name: "Business",
      price: "R$ 199",
      pricePeriod: "/ seat / month",
      description: "Companies of any size that need team features and faster support.",
      features: [
        "Everything in Pro",
        "Veesker Cloud (when available) — team workspace, audit central, query approval",
        "1-business-day support SLA",
        "Private Slack/Teams channel",
        "Multi-environment promote (VRAS)",
        "EBS Pack & on-prem AI add-ons available",
      ],
      cta: { label: "Start trial", href: "/contact?subject=Business" },
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      pricePeriod: "annual contract",
      description: "Regulated industries, large enterprises, and government.",
      features: [
        "Everything in Business",
        "4-hour support SLA",
        "Dedicated customer success engineer",
        "On-prem AI gateway included",
        "SSO / SAML / Active Directory",
        "Audit log shipping (Splunk / Datadog / S3)",
        "Indemnification clause available",
        "White-label / OEM build available",
        "Onboarding & training included",
      ],
      cta: { label: "Talk to sales", href: "/contact?subject=Enterprise" },
    },
  ];

  type AddOn = { name: string; description: string; price: string };

  const addons: AddOn[] = [
    { name: "Oracle EBS Pack", description: "Wizards, GL/AP integration templates, Forms converter", price: "R$ 4.000 / year / company" },
    { name: "Audit Log Shipper", description: "Splunk HEC, Datadog Logs, S3, generic webhook destinations", price: "R$ 1.500 / year / seat" },
    { name: "AWR Analyzer", description: "AWR/Statspack visualization, performance regression detection", price: "R$ 1.500 / year / seat" },
    { name: "Compliance Pack BR", description: "LGPD audit reports, BACEN-ready logs, ANPD breach response template", price: "R$ 2.000 / year / company" },
    { name: "Azure OpenAI / AWS Bedrock", description: "Use your cloud subscription for Sheep AI", price: "R$ 500 / month / company" },
    { name: "On-prem LLM gateway", description: "Connect Sheep to local Llama / Mistral via Ollama", price: "R$ 1.000 / month / company" },
  ];
</script>

<svelte:head>
  <title>Pricing — Veesker</title>
</svelte:head>

<section class="hero">
  <div class="container">
    <h1>Pricing</h1>
    <p class="lead">
      The Veesker source code is fully open under Apache 2.0 — for everyone, forever.
      Larger organizations support continued development through a subscription, in the spirit of Docker Desktop.
    </p>
  </div>
</section>

<section class="tiers-wrap">
  <div class="container">
    <div class="tiers">
      {#each tiers as t}
        <div class="tier" class:highlight={t.highlight}>
          {#if t.highlight}<div class="ribbon">Recommended</div>{/if}
          <h2>{t.name}</h2>
          <div class="price">
            <span class="amt">{t.price}</span>
            <span class="period">{t.pricePeriod}</span>
          </div>
          <p class="desc">{t.description}</p>
          <ul>
            {#each t.features as f}<li>{f}</li>{/each}
          </ul>
          <a href={t.cta.href} class="btn primary cta">{t.cta.label}</a>
        </div>
      {/each}
    </div>
  </div>
</section>

<section class="addons">
  <div class="container">
    <h2>Add-ons</h2>
    <p class="lead">
      Niche-deep paid plugins for specific use cases. Available à la carte for Pro/Business
      or included with Enterprise.
    </p>
    <div class="addon-grid">
      {#each addons as a}
        <div class="addon">
          <h3>{a.name}</h3>
          <p>{a.description}</p>
          <div class="price-line">{a.price}</div>
        </div>
      {/each}
    </div>
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
          codebase. Subscription gives you the right to use the packaged app commercially +
          support + (in higher tiers) access to Veesker Cloud.
        </p>
      </div>
      <div>
        <h3>What happens if I miss compliance?</h3>
        <p>
          Veesker has no kill-switch. The app keeps working. Compliance is contractual / honor-based,
          like Docker Desktop. We trust our users to do the right thing.
        </p>
      </div>
      <div>
        <h3>Can I self-host Veesker Cloud?</h3>
        <p>
          Enterprise tier supports self-hosted deployment. Business uses our managed cloud only.
        </p>
      </div>
      <div>
        <h3>Is there a free trial?</h3>
        <p>
          30-day free trial available for Business and Enterprise on request.
          <a href="/contact">Contact us</a>.
        </p>
      </div>
      <div>
        <h3>Are open-source maintainers eligible for free Pro?</h3>
        <p>
          Yes. If you maintain a public OSS project (≥6 months active, ≥50 stars or equivalent),
          you qualify for a free Pro license. <a href="/contact?subject=OSS license">Apply here</a>.
        </p>
      </div>
      <div>
        <h3>Government / education discount?</h3>
        <p>
          50% off Business and Enterprise tiers for public sector, federal/state universities,
          and registered NGOs.
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

  .tiers-wrap { padding: 30px 0 60px; }
  .tiers {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  .tier {
    position: relative;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px 22px;
    display: flex;
    flex-direction: column;
  }
  .tier.highlight {
    border-color: rgba(179,62,31,0.5);
    background: linear-gradient(180deg, rgba(179,62,31,0.08), var(--bg-soft));
  }
  .ribbon {
    position: absolute; top: -12px; right: 16px;
    background: var(--accent); color: #fff;
    padding: 4px 10px; border-radius: 100px;
    font-size: 10.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .tier h2 { font-size: 22px; margin: 0 0 12px; }
  .price {
    display: flex; align-items: baseline; gap: 6px;
    margin-bottom: 14px;
  }
  .amt { font-size: 32px; font-weight: 700; font-family: "Space Grotesk", sans-serif; }
  .period { color: var(--text-muted); font-size: 13px; }
  .desc {
    color: var(--text-muted); font-size: 13px; line-height: 1.55;
    margin: 0 0 18px; min-height: 60px;
  }
  ul {
    list-style: none; padding: 0; margin: 0 0 22px;
    flex: 1;
  }
  li {
    padding: 6px 0;
    font-size: 13px;
    color: var(--text);
    border-top: 1px dashed var(--border);
  }
  li:first-child { border-top: none; }
  li::before { content: "✓"; color: var(--accent-text); margin-right: 8px; font-weight: 700; }
  .cta { width: 100%; justify-content: center; }

  .addons { padding: 80px 0 40px; }
  .addons h2 { text-align: center; font-size: 32px; margin-bottom: 14px; }
  .addons .lead { text-align: center; margin-bottom: 36px; }
  .addon-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
  }
  .addon {
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 10px; padding: 20px;
  }
  .addon h3 { font-size: 15px; margin: 0 0 8px; }
  .addon p { color: var(--text-muted); font-size: 13px; margin: 0 0 12px; line-height: 1.5; }
  .price-line {
    font-family: "Space Grotesk", sans-serif; font-weight: 600;
    color: var(--accent-text); font-size: 13px;
  }

  .faq { padding: 80px 0; }
  .faq h2 { font-size: 32px; margin-bottom: 30px; text-align: center; }
  .faq-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 28px;
  }
  .faq h3 { font-size: 16px; margin: 0 0 8px; }
  .faq p { color: var(--text-muted); font-size: 13.5px; line-height: 1.6; margin: 0; }

  @media (max-width: 980px) {
    .tiers { grid-template-columns: 1fr 1fr; }
    .addon-grid { grid-template-columns: 1fr 1fr; }
    .faq-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .tiers, .addon-grid { grid-template-columns: 1fr; }
    h1 { font-size: 36px; }
  }
</style>
