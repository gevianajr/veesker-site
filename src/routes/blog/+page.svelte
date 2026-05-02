<script lang="ts">
  import Seo from "$lib/seo.svelte";
  import { allPosts, type PostLang, type PostSummary, readMinutes } from "$lib/blog/posts";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  let lang = $state<PostLang>("en");

  onMount(() => {
    if (!browser) return;
    const fromQuery = new URL(window.location.href).searchParams.get("lang");
    if (fromQuery === "pt" || fromQuery === "en") {
      lang = fromQuery;
    } else if (navigator.language?.startsWith("pt")) {
      lang = "pt";
    }
  });

  const filtered = $derived(allPosts.filter((p) => p.lang === lang));

  function setLang(next: PostLang) {
    lang = next;
    if (browser) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState({}, "", url.toString());
    }
  }

  function kindLabel(p: PostSummary): string {
    if (p.lang === "pt") return p.kind === "deep-dive" ? "Aprofundamento" : "Manifesto";
    return p.kind === "deep-dive" ? "Deep dive" : "Manifesto";
  }
</script>

<Seo
  title="Blog"
  description="Veesker writes about Oracle development, AI for databases, PL/SQL workflows, and the local-first developer toolchain. Two posts per week — a Monday deep-dive and a Thursday opinion."
  path="/blog"
  image="/datamap-hero.png"
  imageAlt="Veesker blog — Oracle, AI, and developer tools"
/>

<svelte:head>
  <link rel="alternate" type="application/rss+xml" title="Veesker Blog (English)" href="https://veesker.cloud/blog/rss.xml" />
  <link rel="alternate" type="application/rss+xml" title="Veesker Blog (Português)" href="https://veesker.cloud/blog/pt/rss.xml" />
</svelte:head>

<section class="hero">
  <div class="container">
    <div class="eyebrow">{lang === "en" ? "Blog" : "Blog"}</div>
    <h1>
      {#if lang === "en"}
        Notes from the Oracle + AI workshop.
      {:else}
        Notas da oficina Oracle + AI.
      {/if}
    </h1>
    <p class="lead">
      {#if lang === "en"}
        Two posts per week. Mondays are deep-dives — code, EXPLAIN PLAN, architectural decisions.
        Thursdays are short manifestos — opinions, takes, calls to action.
      {:else}
        Dois posts por semana. Segundas são aprofundamentos — código, EXPLAIN PLAN, decisões de arquitetura.
        Quintas são manifestos curtos — opiniões, pontos de vista, provocações.
      {/if}
    </p>

    <div class="lang-switch" role="group" aria-label="Language">
      <button class:active={lang === "en"} onclick={() => setLang("en")}>English</button>
      <button class:active={lang === "pt"} onclick={() => setLang("pt")}>Português</button>
      <a class="rss-link" href={lang === "en" ? "/blog/rss.xml" : "/blog/pt/rss.xml"} target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
          <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44V8a12 12 0 0 1 12 12h3.56A15.56 15.56 0 0 0 4 4.44zm0 5.66v3.56A6.34 6.34 0 0 1 10.34 20H13.9A9.9 9.9 0 0 0 4 10.1z"/>
        </svg>
        RSS
      </a>
    </div>
  </div>
</section>

<section class="posts">
  <div class="container">
    {#if filtered.length === 0}
      <div class="empty">
        {#if lang === "en"}
          No posts yet in English. Check back Monday.
        {:else}
          Nenhum post ainda em Português. Volte na segunda.
        {/if}
      </div>
    {:else}
      <ol class="post-list">
        {#each filtered as p (p.slug)}
          <li class="post-card">
            <a href="/blog/{p.slug}" class="post-link">
              <div class="post-meta">
                <span class="post-date">{p.date}</span>
                <span class="post-kind kind-{p.kind}">{kindLabel(p)}</span>
                <span class="post-read">{readMinutes(p.words)} min read</span>
              </div>
              <h2>{p.title}</h2>
              <p class="post-desc">{p.description}</p>
              <div class="post-tags">
                {#each p.tags as t}
                  <span class="tag">#{t}</span>
                {/each}
              </div>
            </a>
          </li>
        {/each}
      </ol>
    {/if}
  </div>
</section>

<style>
  .hero {
    padding: 80px 0 30px;
    text-align: center;
  }
  .eyebrow {
    display: inline-block;
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #f7b49f;
    background: rgba(245, 160, 138, 0.12);
    border: 1px solid rgba(245, 160, 138, 0.32);
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
    font-size: 16px;
    line-height: 1.65;
    max-width: 720px;
    margin: 0 auto 24px;
  }
  .lang-switch {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 100px;
  }
  .lang-switch button {
    background: transparent;
    color: var(--text-muted);
    border: none;
    padding: 6px 14px;
    border-radius: 100px;
    cursor: pointer;
    font-size: 12.5px;
    font-weight: 600;
    transition: background 0.14s ease, color 0.14s ease;
  }
  .lang-switch button:hover {
    color: var(--text);
  }
  .lang-switch button.active {
    background: var(--accent);
    color: #fff;
  }
  .rss-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-muted);
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 6px 12px;
    border-left: 1px solid var(--border);
    margin-left: 4px;
  }
  .rss-link:hover {
    color: var(--accent-text);
    text-decoration: none;
  }

  .posts {
    padding: 30px 0 80px;
  }
  .empty {
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
    color: var(--text-muted);
    font-size: 15px;
    padding: 60px 0;
    border: 1px dashed var(--border);
    border-radius: 12px;
  }
  .post-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-width: 880px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .post-card {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: border-color 0.14s ease, transform 0.14s ease;
  }
  .post-card:hover {
    border-color: rgba(245, 160, 138, 0.4);
    transform: translateY(-2px);
  }
  .post-link {
    display: block;
    padding: 26px 30px;
    color: var(--text);
    text-decoration: none;
  }
  .post-link:hover {
    text-decoration: none;
  }
  .post-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 10px;
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
  .post-card h2 {
    font-size: 22px;
    line-height: 1.3;
    margin: 0 0 8px;
  }
  .post-desc {
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 14px;
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

  @media (max-width: 720px) {
    h1 {
      font-size: 32px;
    }
    .post-link {
      padding: 22px;
    }
  }
</style>
