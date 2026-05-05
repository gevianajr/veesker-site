<script lang="ts">
  import { browser } from "$app/environment";
  import Seo from "$lib/seo.svelte";
  import ScrollReveal from "$lib/components/ScrollReveal.svelte";

  let subject = $state("Inquiry");

  $effect(() => {
    if (browser) {
      const fromQuery = new URL(window.location.href).searchParams.get("subject");
      if (fromQuery) subject = fromQuery;
    }
  });

  const mailto = $derived(`mailto:geraldovianajr@veesker.cloud?subject=${encodeURIComponent("[Veesker] " + subject)}`);
</script>

<Seo
  title="Contact"
  description="Contact Veesker — sales, support, partnerships, OSS license requests. Email response within 2 business days."
  path="/contact"
/>

<ScrollReveal>
  <section class="hero">
    <div class="container">
      <h1>Contact</h1>
      <p class="lead">
        Sales, support, partnerships, OSS license requests — pick a channel below or open a pre-filled email.
      </p>

    <div class="card">
      <div class="row">
        <span class="lbl">Subject:</span>
        <span class="val">{subject}</span>
      </div>
      <div class="row">
        <span class="lbl">Direct email:</span>
        <a href={mailto} class="val email">geraldovianajr@veesker.cloud</a>
      </div>
      <div class="row">
        <span class="lbl">Response time:</span>
        <span class="val muted">Best effort within 2 business days. Cloud customers will get faster response per SLA when Cloud reaches GA (Coming Soon — H2 2026).</span>
      </div>
      <a href={mailto} class="btn primary">Open mail client</a>
    </div>

    <div class="role-emails">
      <h3>By topic</h3>
      <p class="role-note">All addresses currently route to the founder. Aliases will become role-based once the team grows.</p>
      <div class="role-grid">
        <a href="mailto:geraldovianajr@veesker.cloud?subject=%5BVeesker%5D%20Sales" class="role-card">
          <div class="role-name">Sales</div>
          <div class="role-desc">Cloud waitlist, Enterprise pricing, on-premise needs</div>
        </a>
        <a href="mailto:geraldovianajr@veesker.cloud?subject=%5BVeesker%5D%20Support" class="role-card">
          <div class="role-name">Support</div>
          <div class="role-desc">Bug reports, install issues, urgent help</div>
        </a>
        <a href="mailto:geraldovianajr@veesker.cloud?subject=%5BVeesker%5D%20Security" class="role-card">
          <div class="role-name">Security</div>
          <div class="role-desc">Vulnerability disclosure, security questions</div>
        </a>
        <a href="mailto:geraldovianajr@veesker.cloud?subject=%5BVeesker%5D%20Press" class="role-card">
          <div class="role-name">Press</div>
          <div class="role-desc">Media inquiries, founder interviews, brand assets</div>
        </a>
      </div>
    </div>

    <div class="links">
      <h3>Other channels</h3>
      <ul>
        <li><a href="https://github.com/veesker-cloud/veesker-community-edition/issues" target="_blank" rel="noopener">GitHub Issues</a> — bugs and feature requests</li>
        <li><a href="https://github.com/veesker-cloud/veesker-community-edition/discussions" target="_blank" rel="noopener">GitHub Discussions</a> — community Q&A</li>
        <li><a href="https://github.com/veesker-cloud/veesker-community-edition/blob/main/SECURITY.md" target="_blank" rel="noopener">Security disclosure</a> — responsible disclosure policy</li>
      </ul>
      </div>
    </div>
  </section>
</ScrollReveal>

<style>
  .hero { padding: 80px 0 60px; }
  h1 { font-size: 48px; margin-bottom: 16px; }
  .lead { color: var(--text-muted); font-size: 16px; line-height: 1.6; margin-bottom: 36px; }
  .card {
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 12px; padding: 28px; max-width: 640px;
  }
  .row { display: flex; gap: 12px; align-items: baseline; padding: 8px 0; border-bottom: 1px dashed var(--border); }
  .row:last-of-type { border-bottom: none; }
  .lbl { color: var(--text-muted); width: 130px; font-size: 13px; }
  .val { font-size: 14px; }
  .val.email { color: var(--accent-text); font-family: "JetBrains Mono", monospace; }
  .val.muted { color: var(--text-muted); }
  .card .btn { margin-top: 18px; }

  .role-emails { margin-top: 48px; max-width: 640px; }
  .role-emails h3 { font-size: 18px; margin: 0 0 6px; }
  .role-note { color: var(--text-muted); font-size: 12.5px; margin: 0 0 16px; }
  .role-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .role-card {
    display: block;
    padding: 16px 18px;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 10px;
    text-decoration: none;
    color: var(--text);
    transition: border-color 0.14s ease, transform 0.14s ease;
  }
  .role-card:hover {
    border-color: var(--accent);
    transform: translateY(-1px);
    text-decoration: none;
  }
  .role-name {
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    font-weight: 600;
    color: var(--accent-text);
    margin-bottom: 4px;
  }
  .role-desc {
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.5;
  }

  .links { margin-top: 48px; max-width: 640px; }
  .links h3 { font-size: 18px; margin-bottom: 14px; }
  .links ul { list-style: none; padding: 0; margin: 0; }
  .links li { padding: 8px 0; color: var(--text-muted); font-size: 14px; }
  .links a { color: var(--accent-text); }

  @media (max-width: 600px) {
    .role-grid { grid-template-columns: 1fr; }
  }
</style>
