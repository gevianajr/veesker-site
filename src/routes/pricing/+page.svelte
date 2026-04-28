<script lang="ts">
  import Seo from "$lib/seo.svelte";
</script>

<Seo
  title="Pricing"
  description="Community Edition is free and open source under Apache 2.0. Veesker Cloud Beta adds optional managed intelligence for schema-aware AI, team workflows, and usage-based operations."
  path="/pricing"
/>

<section class="hero">
  <div class="container">
    <h1>Pricing</h1>
    <p class="lead">
      Community is free forever and fully open source. Cloud is an optional managed intelligence layer.
    </p>
  </div>
</section>

<section class="plans" aria-label="Community and Cloud plans">
  <div class="container">
    <div class="plan-grid">
      <article class="plan ce" id="community">
        <div class="plan-head">
          <img src="/veesker-community-logo.png" alt="Veesker Community Edition" width="1024" height="1024" class="plan-logo" loading="lazy" />
          <div>
            <span class="plan-name">Community Edition</span>
            <span class="plan-badge ce-badge">Free forever</span>
          </div>
        </div>

        <div class="plan-price">$0 <span class="plan-cycle">/ forever</span></div>
        <p class="plan-desc">
          Local-first Oracle IDE with no forced subscription and no crippled core workflow.
        </p>

        <a href="/download" class="btn primary plan-btn">Download Community</a>

        <ul class="plan-features">
          <li>Full SQL and PL/SQL IDE</li>
          <li>Schema browser and dependency workflows</li>
          <li>PL/SQL debugger and execution tooling</li>
          <li>VRAS and vector tooling</li>
          <li>BYOK AI for explain and generate SQL</li>
          <li>Apache 2.0 open-source codebase</li>
        </ul>
      </article>

      <article class="plan cloud" id="cloud">
        <div class="plan-head">
          <img src="/veesker-cloud-logo.png" alt="Veesker Cloud" width="1536" height="1024" class="plan-logo cloud-logo" loading="lazy" />
          <div>
            <span class="plan-name">Veesker Cloud</span>
            <span class="plan-badge cloud-badge">Beta</span>
          </div>
        </div>

        <div class="plan-price">Usage-based <span class="plan-cycle">/ managed intelligence</span></div>
        <p class="plan-desc">
          Optional managed AI layer for Oracle teams that want deeper intelligence, automation, and collaboration.
        </p>

        <a href="/contact?subject=Cloud%20Beta%20Access" class="btn cloud plan-btn">Join Cloud Beta</a>

        <ul class="plan-features">
          <li>Schema-aware AI context</li>
          <li>Managed AI without API key handling</li>
          <li>AI-assisted execution and optimization workflows</li>
          <li>Intelligent automation capabilities</li>
          <li>Team workflows and shared operational context</li>
          <li>Usage and billing visibility</li>
        </ul>
      </article>
    </div>
  </div>
</section>

<section class="faq">
  <div class="container">
    <h2>Frequently asked</h2>
    <div class="faq-grid">
      <div>
        <h3>Is the Community Edition complete?</h3>
        <p>
          Yes. Community is the full local-first IDE and remains fully usable on its own.
          Cloud is optional and focused on managed intelligence, not feature removal.
        </p>
      </div>
      <div>
        <h3>Does Cloud require direct database exposure?</h3>
        <p>
          No. Credentials and database access remain local in your desktop workflow.
          Cloud powers managed intelligence workflows as an optional layer.
        </p>
      </div>
      <div>
        <h3>Can we adopt in phases?</h3>
        <p>
          Yes. Start with Community, then enable Cloud Beta for selected teams or projects when needed.
        </p>
      </div>
      <div>
        <h3>How do we join the beta?</h3>
        <p>
          Use <a href="/contact?subject=Cloud%20Beta%20Access">Join Cloud Beta</a> and share your use case.
          We are onboarding teams in controlled waves.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: 80px 0 38px;
    text-align: center;
  }
  h1 {
    font-size: 48px;
    margin-bottom: 14px;
  }
  .lead {
    color: var(--text-muted);
    font-size: 16px;
    line-height: 1.6;
    max-width: 660px;
    margin: 0 auto;
  }

  .plans {
    padding: 20px 0 80px;
  }
  .plan-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    max-width: 980px;
    margin: 0 auto;
  }
  .plan {
    border-radius: 14px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 1px solid var(--border);
  }
  .plan.ce {
    background: linear-gradient(160deg, rgba(179, 62, 31, 0.11), rgba(179, 62, 31, 0.03));
    border-color: rgba(245, 160, 138, 0.32);
  }
  .plan.cloud {
    background:
      radial-gradient(120% 100% at 0% 0%, rgba(43, 180, 238, 0.2), transparent 46%),
      linear-gradient(165deg, rgba(22, 29, 36, 0.96), rgba(16, 22, 29, 0.97));
    border-color: rgba(138, 216, 251, 0.38);
    box-shadow: 0 12px 28px rgba(14, 76, 103, 0.25);
  }

  .plan-head {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .plan-logo {
    width: 74px;
    height: 74px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.16);
  }
  .plan-logo.cloud-logo {
    object-position: center 28%;
  }
  .plan-name {
    display: block;
    font-size: 18px;
    font-weight: 700;
  }
  .plan.ce .plan-name {
    color: #f5b3a0;
  }
  .plan.cloud .plan-name {
    color: #9adfff;
  }

  .plan-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 3px 9px;
    border-radius: 100px;
    margin-top: 6px;
  }
  .ce-badge {
    background: rgba(179, 62, 31, 0.22);
    color: #f7b49f;
    border: 1px solid rgba(245, 160, 138, 0.4);
  }
  .cloud-badge {
    background: rgba(43, 180, 238, 0.2);
    color: #b8ebff;
    border: 1px solid rgba(138, 216, 251, 0.46);
  }

  .plan-price {
    font-size: 34px;
    font-weight: 700;
    line-height: 1.1;
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
  .plan-btn {
    width: 100%;
    justify-content: center;
  }

  .plan-features {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .plan-features li {
    padding: 8px 0;
    font-size: 13.5px;
    color: rgba(245, 241, 232, 0.84);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  .plan-features li:first-child {
    border-top: none;
  }
  .plan.ce .plan-features li::before {
    content: "+ ";
    color: var(--accent-text);
  }
  .plan.cloud .plan-features li::before {
    content: "+ ";
    color: var(--cloud-text);
  }

  .faq {
    padding: 0 0 80px;
  }
  .faq h2 {
    font-size: 32px;
    margin-bottom: 26px;
    text-align: center;
  }
  .faq-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    max-width: 980px;
    margin: 0 auto;
  }
  .faq-grid > div {
    padding: 22px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.02);
  }
  .faq h3 {
    font-size: 17px;
    margin: 0 0 8px;
  }
  .faq p {
    color: var(--text-muted);
    font-size: 13.5px;
    line-height: 1.6;
    margin: 0;
  }
  .faq a {
    color: var(--cloud-text);
  }

  @media (max-width: 900px) {
    .plan-grid,
    .faq-grid {
      grid-template-columns: 1fr;
    }
    h1 {
      font-size: 38px;
    }
  }
</style>
