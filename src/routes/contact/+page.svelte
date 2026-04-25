<script lang="ts">
  import { page } from "$app/state";
  const subject = $derived(page.url.searchParams.get("subject") ?? "Inquiry");
  const mailto = $derived(`mailto:geefatec@gmail.com?subject=${encodeURIComponent("[Veesker] " + subject)}`);
</script>

<svelte:head><title>Contact — Veesker</title></svelte:head>

<section class="hero">
  <div class="container">
    <h1>Contact</h1>
    <p class="lead">
      Sales, support, partnerships, OSS license requests, custom arrangements — same email, fast response.
    </p>
    <div class="card">
      <div class="row">
        <span class="lbl">Subject:</span>
        <span class="val">{subject}</span>
      </div>
      <div class="row">
        <span class="lbl">Email:</span>
        <a href={mailto} class="val email">geefatec@gmail.com</a>
      </div>
      <div class="row">
        <span class="lbl">Response time:</span>
        <span class="val muted">Best effort within 2 business days. Business / Enterprise customers per SLA.</span>
      </div>
      <a href={mailto} class="btn primary">Open mail client</a>
    </div>

    <div class="links">
      <h3>Other channels</h3>
      <ul>
        <li><a href="https://github.com/geeviana/veesker/issues" target="_blank" rel="noopener">GitHub Issues</a> — bugs and feature requests</li>
        <li><a href="https://github.com/geeviana/veesker/discussions" target="_blank" rel="noopener">GitHub Discussions</a> — community Q&A</li>
        <li><a href="https://github.com/geeviana/veesker/blob/main/SECURITY.md" target="_blank" rel="noopener">Security disclosure</a> — responsible disclosure policy</li>
      </ul>
    </div>
  </div>
</section>

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
  .links { margin-top: 48px; max-width: 640px; }
  .links h3 { font-size: 18px; margin-bottom: 14px; }
  .links ul { list-style: none; padding: 0; margin: 0; }
  .links li { padding: 8px 0; color: var(--text-muted); font-size: 14px; }
  .links a { color: var(--accent-text); }
</style>
