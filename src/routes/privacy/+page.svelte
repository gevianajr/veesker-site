<script lang="ts">
  import Seo from "$lib/seo.svelte";
  import ScrollReveal from "$lib/components/ScrollReveal.svelte";
</script>

<Seo
  title="Privacy Policy"
  description="What data Veesker collects, why, where it lives, how long we keep it, and how to ask for removal. Plain language, LGPD/GDPR-aligned."
  path="/privacy"
/>

<ScrollReveal>
  <section class="hero">
    <div class="container">
      <div class="eyebrow">Privacy Policy</div>
      <h1>Privacy at Veesker.</h1>
      <p class="lead">
        Plain language, no dark patterns. This page explains exactly what data we collect,
        why we collect it, and how to remove it.
        <strong>Last updated: 2026-05-02.</strong>
      </p>
    </div>
  </section>
</ScrollReveal>

<ScrollReveal>
  <section class="content">
    <div class="container narrow">
    <h2>Who is the data controller</h2>
    <p>
      <strong>Geraldo Ferreira Viana Júnior</strong> (sole founder of Veesker), based in São Paulo, Brazil.
      Contact for any privacy request:
      <a href="mailto:geraldovianajr@veesker.cloud?subject=%5BPRIVACY%5D%20Request">geraldovianajr@veesker.cloud</a>
      with subject prefix <code>[PRIVACY]</code>.
    </p>

    <h2>What data we collect</h2>

    <h3>1. Veesker Cloud waitlist</h3>
    <p>If you submit your email through the Cloud waitlist on the homepage, we store:</p>
    <ul>
      <li><strong>Email address</strong> (the one you typed).</li>
      <li><strong>Source label</strong> (defaults to <code>veesker.cloud</code>).</li>
      <li><strong>Hashed truncated IP</strong> (SHA-256 of <code>ip + salt</code>, 16 hex chars) — for abuse triage only, not the raw IP.</li>
      <li><strong>User-Agent string</strong> truncated to 200 chars.</li>
      <li><strong>Submission timestamp.</strong></li>
    </ul>
    <p>
      <strong>Lawful basis:</strong> legitimate interest (you opted in by submitting the form to be notified
      about Veesker Cloud).
    </p>
    <p>
      <strong>Where it lives:</strong> a Postgres database hosted on Railway, accessed via the
      <code>api.veesker.cloud</code> service. Only the founder has access.
    </p>
    <p>
      <strong>Retention:</strong> kept until Veesker Cloud reaches General Availability (target H2 2026) plus
      one notification email about the launch. After that — or any time you request removal — your row is
      deleted within 7 days.
    </p>
    <p>
      <strong>Sharing:</strong> never sold, never shared with marketing partners, never used for
      anything other than notifying you about Cloud availability and founder pricing.
    </p>

    <h3>2. Veesker Community Edition (the desktop app)</h3>
    <p>
      The Community IDE is local-first by design. The desktop app does not phone home about your usage,
      does not collect telemetry, and does not transmit your database credentials, queries, or query results
      anywhere outside your machine.
    </p>
    <p>The only outbound calls the desktop app makes are:</p>
    <ul>
      <li><strong>Auto-update check</strong> — fetches the release manifest from GitHub Releases. No user identifier is sent.</li>
      <li><strong>BYOK AI calls</strong> — when you bring your own OpenAI / Anthropic / local-model key and explicitly run an AI action, the prompt and your key go directly to that provider. We are not in the loop.</li>
    </ul>

    <h3>3. Veesker Cloud (when you opt in, post-launch)</h3>
    <p>
      Veesker Cloud is in development (Coming Soon — H2 2026). When it launches, opting in will
      involve managed AI workflows that <em>may</em> process query metadata to ground responses
      in your schema. The Cloud tier will ship with its own privacy addendum before GA. This page
      will be updated and dated when that happens.
    </p>
    <p>
      Cloud features are strictly opt-in. Community Edition will continue to work fully offline
      with no Cloud component.
    </p>

    <h3>4. Website (veesker.cloud)</h3>
    <ul>
      <li><strong>No cookies for tracking.</strong> No Google Analytics, no Segment, no Mixpanel, no Hotjar.</li>
      <li>Hosting on Cloudflare Workers — Cloudflare may log request metadata (IP, URL, user-agent) for abuse mitigation per their own privacy policy. Veesker does not store, query, or process those logs.</li>
      <li><strong>No third-party scripts.</strong> Only fonts.googleapis.com (Google Fonts) and shields.io badges (GitHub stars), which run client-side without identifiers we attach.</li>
    </ul>

    <h3>5. Blog</h3>
    <p>
      The blog at <a href="/blog">/blog</a> serves static markdown. Reading a post does not send
      any identifier to Veesker. The RSS feed is unauthenticated and uncounted.
    </p>

    <h2>Your rights</h2>
    <p>Whether you are in Brazil (LGPD), the EU (GDPR), or anywhere else, you have the right to:</p>
    <ul>
      <li><strong>Access</strong> — ask us what data we have about you.</li>
      <li><strong>Correct</strong> — fix anything wrong.</li>
      <li><strong>Delete</strong> — ask for full removal. Granted within 7 days of receiving the request.</li>
      <li><strong>Object</strong> — withdraw your waitlist opt-in at any time.</li>
      <li><strong>Portability</strong> — request a copy of your data in JSON.</li>
    </ul>
    <p>
      To exercise any of these rights, email
      <a href="mailto:geraldovianajr@veesker.cloud?subject=%5BPRIVACY%5D%20Request">geraldovianajr@veesker.cloud</a>
      with subject <code>[PRIVACY]</code> and a one-line description of what you want.
      No account or login required — just the email you used.
    </p>

    <h2>Children</h2>
    <p>
      Veesker is a tool for professional Oracle developers. We do not knowingly collect data from
      anyone under 16. If you believe a minor submitted their email to the waitlist, please email
      us and we will delete the record immediately.
    </p>

    <h2>Security</h2>
    <p>
      The waitlist API enforces rate limits, never logs raw IPs, validates email format on submit,
      and uses TLS end-to-end. The repository is open-source and continuously audited via CodeQL
      and Dependabot. See <a href="/security">/security</a> for the full trust model.
    </p>

    <h2>Changes to this policy</h2>
    <p>
      If this policy changes materially, we will update the "Last updated" date at the top, post
      a note in <a href="/changelog">/changelog</a>, and email anyone on the waitlist before
      the change takes effect.
    </p>

    <h2>Contact</h2>
    <p>
      <a href="mailto:geraldovianajr@veesker.cloud?subject=%5BPRIVACY%5D%20Request">geraldovianajr@veesker.cloud</a>
      ·
      <a href="https://www.linkedin.com/in/geraldovianajr/" target="_blank" rel="noopener">LinkedIn</a>
    </p>
    </div>
  </section>
</ScrollReveal>

<style>
  .hero {
    padding: 80px 0 30px;
  }
  .narrow {
    max-width: 760px;
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
    font-size: 44px;
    margin: 0 0 18px;
    letter-spacing: -0.02em;
  }
  .lead {
    color: var(--text-muted);
    font-size: 17px;
    line-height: 1.65;
    margin: 0;
  }
  .lead strong {
    color: var(--text);
    font-weight: 600;
  }

  .content {
    padding: 30px 0 80px;
  }
  .content h2 {
    font-size: 26px;
    margin: 38px 0 14px;
    letter-spacing: -0.01em;
  }
  .content h3 {
    font-size: 19px;
    margin: 28px 0 10px;
  }
  .content p {
    color: var(--text);
    font-size: 16px;
    line-height: 1.75;
    margin: 0 0 18px;
  }
  .content ul {
    color: var(--text);
    font-size: 16px;
    line-height: 1.75;
    padding-left: 1.5rem;
    margin: 0 0 18px;
  }
  .content li {
    margin-bottom: 6px;
  }
  .content a {
    color: var(--accent-text);
  }
  .content strong {
    font-weight: 600;
  }
  .content em {
    color: var(--text-muted);
  }
  .content code {
    font-family: "JetBrains Mono", monospace;
    background: rgba(245, 241, 232, 0.08);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 14px;
  }

  @media (max-width: 720px) {
    h1 { font-size: 32px; }
    .lead { font-size: 15px; }
    .content h2 { font-size: 22px; }
    .content p, .content ul { font-size: 15px; }
  }
</style>
