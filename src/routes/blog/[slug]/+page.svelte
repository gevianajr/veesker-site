<script lang="ts">
  import Seo from "$lib/seo.svelte";
  import { readMinutes } from "$lib/blog/posts";

  let { data } = $props();
  const Component = $derived(data.Component);
  const md = $derived(data.metadata);
</script>

<Seo
  title={md.title}
  description={md.description}
  path={`/blog/${md.slug}`}
  image={md.hero ?? "/datamap-hero.png"}
  imageAlt={md.title}
/>

<article class="post">
  <header class="post-header">
    <div class="container narrow">
      <a href="/blog" class="back-link">← Back to blog</a>
      <div class="post-meta">
        <span class="post-date">{md.date}</span>
        <span class="post-kind kind-{md.kind}">
          {md.lang === "pt" ? (md.kind === "deep-dive" ? "Aprofundamento" : "Manifesto") : (md.kind === "deep-dive" ? "Deep dive" : "Manifesto")}
        </span>
        <span class="post-read">{readMinutes(md.words)} min</span>
        {#if md.translation_slug}
          <a class="lang-toggle" href="/blog/{md.translation_slug}">
            {md.lang === "en" ? "Ler em Português →" : "Read in English →"}
          </a>
        {/if}
      </div>
      <h1>{md.title}</h1>
      <p class="post-desc">{md.description}</p>
      <div class="post-tags">
        {#each md.tags as t}
          <span class="tag">#{t}</span>
        {/each}
      </div>
    </div>
  </header>

  {#if md.hero}
    <figure class="post-hero">
      <img src={md.hero} alt={md.title} loading="eager" />
    </figure>
  {/if}

  <section class="post-body">
    <div class="container narrow">
      <Component />
    </div>
  </section>

  <footer class="post-footer">
    <div class="container narrow">
      <div class="byline">
        <strong>Veesker</strong> — Oracle development platform for the AI agent era.
      </div>
      <div class="cta-row">
        <a href="/download" class="btn primary">Download Community</a>
        <a href="/#waitlist" class="btn cloud">Join Cloud waitlist →</a>
      </div>
      <p class="auto-note">
        Posts are written and published by an autonomous Claude agent on a weekly schedule —
        edited and signed off by Geraldo Viana. <a href="/about">Read why →</a>
      </p>
    </div>
  </footer>
</article>

<style>
  .narrow {
    max-width: 760px;
  }
  .post-header {
    padding: 60px 0 28px;
  }
  .back-link {
    display: inline-block;
    margin-bottom: 24px;
    color: var(--text-muted);
    font-size: 13px;
    text-decoration: none;
  }
  .back-link:hover {
    color: var(--accent-text);
  }
  .post-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .post-date {
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    letter-spacing: 0.04em;
    color: var(--text-muted);
  }
  .post-kind {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 3px 9px;
    border-radius: 100px;
  }
  .kind-deep-dive {
    background: rgba(43, 180, 238, 0.18);
    color: #b9ebff;
    border: 1px solid rgba(138, 216, 251, 0.4);
  }
  .kind-manifesto {
    background: rgba(247, 180, 159, 0.18);
    color: #f7b49f;
    border: 1px solid rgba(245, 160, 138, 0.4);
  }
  .post-read {
    font-size: 11.5px;
    color: var(--text-muted);
  }
  .lang-toggle {
    margin-left: auto;
    font-size: 12px;
    color: var(--accent-text);
    text-decoration: none;
    padding: 4px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
  }
  .lang-toggle:hover {
    border-color: var(--accent);
  }
  .post-header h1 {
    font-size: 42px;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }
  .post-desc {
    color: var(--text-muted);
    font-size: 17px;
    line-height: 1.6;
    margin: 0 0 18px;
  }
  .post-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .tag {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    color: var(--text-muted);
    background: rgba(245, 241, 232, 0.05);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .post-hero {
    margin: 0 auto 32px;
    max-width: 1080px;
    padding: 0 16px;
  }
  .post-hero img {
    width: 100%;
    height: auto;
    border-radius: 14px;
    border: 1px solid var(--border);
    display: block;
  }

  .post-body {
    padding: 8px 0 60px;
  }

  /* Markdown body styling */
  .post-body :global(h2) {
    font-size: 26px;
    margin: 38px 0 14px;
    letter-spacing: -0.01em;
  }
  .post-body :global(h3) {
    font-size: 19px;
    margin: 28px 0 10px;
  }
  .post-body :global(p) {
    color: var(--text);
    font-size: 16px;
    line-height: 1.75;
    margin: 0 0 18px;
  }
  .post-body :global(ul),
  .post-body :global(ol) {
    color: var(--text);
    font-size: 16px;
    line-height: 1.75;
    padding-left: 1.5rem;
    margin: 0 0 18px;
  }
  .post-body :global(li) {
    margin-bottom: 6px;
  }
  .post-body :global(a) {
    color: var(--accent-text);
  }
  .post-body :global(strong) {
    color: var(--text);
    font-weight: 600;
  }
  .post-body :global(code) {
    font-family: "JetBrains Mono", monospace;
    font-size: 13.5px;
    background: rgba(245, 241, 232, 0.07);
    padding: 2px 6px;
    border-radius: 4px;
    color: #f5b3a0;
  }
  .post-body :global(pre) {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 18px 20px;
    overflow-x: auto;
    margin: 0 0 22px;
    font-size: 13.5px;
    line-height: 1.6;
  }
  .post-body :global(pre code) {
    background: transparent;
    padding: 0;
    color: var(--text);
  }
  .post-body :global(blockquote) {
    border-left: 3px solid var(--accent);
    padding: 8px 0 8px 18px;
    margin: 0 0 22px;
    color: var(--text-muted);
    font-style: italic;
  }
  .post-body :global(hr) {
    border: none;
    border-top: 1px solid var(--border);
    margin: 36px 0;
  }
  .post-body :global(table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    margin: 0 0 22px;
  }
  .post-body :global(th),
  .post-body :global(td) {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    text-align: left;
  }
  .post-body :global(th) {
    color: var(--text-muted);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .post-footer {
    padding: 40px 0 80px;
    border-top: 1px solid var(--border);
    background: var(--bg-soft);
  }
  .byline {
    color: var(--text-muted);
    font-size: 14px;
    margin: 24px 0 18px;
  }
  .byline strong {
    color: var(--text);
  }
  .cta-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .auto-note {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.6;
    border-top: 1px solid var(--border);
    padding-top: 18px;
    margin: 0;
  }
  .auto-note a {
    color: var(--accent-text);
  }

  @media (max-width: 720px) {
    .post-header h1 {
      font-size: 30px;
    }
    .post-desc {
      font-size: 15px;
    }
  }
</style>
