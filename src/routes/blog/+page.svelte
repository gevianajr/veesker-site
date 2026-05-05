<script lang="ts">
  import Seo from "$lib/seo.svelte";
  import { allPosts, type PostLang, type PostSummary, readMinutes } from "$lib/blog/posts";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import TiltCard from "$lib/components/TiltCard.svelte";
  import ScrollReveal from "$lib/components/ScrollReveal.svelte";
  import { spotlight } from "$lib/actions/spotlight";

  let lang = $state<PostLang>("en");
  let activeTag = $state<string | null>(null);

  onMount(() => {
    if (!browser) return;
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get("lang");
    if (fromQuery === "pt" || fromQuery === "en") {
      lang = fromQuery;
    } else if (navigator.language?.startsWith("pt")) {
      lang = "pt";
    }
    const tagQuery = url.searchParams.get("tag");
    if (tagQuery) activeTag = tagQuery;
  });

  const postsForLang = $derived(allPosts.filter((p) => p.lang === lang));

  const allTags = $derived(() => {
    const counts = new Map<string, number>();
    for (const p of postsForLang) {
      for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  });

  const filtered = $derived(
    activeTag ? postsForLang.filter((p) => p.tags.includes(activeTag!)) : postsForLang
  );

  function setLang(next: PostLang) {
    lang = next;
    activeTag = null;
    syncUrl();
  }

  function setTag(tag: string | null) {
    activeTag = tag;
    syncUrl();
  }

  function syncUrl() {
    if (!browser) return;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    if (activeTag) url.searchParams.set("tag", activeTag);
    else url.searchParams.delete("tag");
    window.history.replaceState({}, "", url.toString());
  }

  function kindLabel(p: PostSummary): string {
    if (p.lang === "pt") return p.kind === "deep-dive" ? "Aprofundamento" : "Manifesto";
    return p.kind === "deep-dive" ? "Deep dive" : "Manifesto";
  }
</script>

<Seo
  title="Blog"
  description="Veesker writes about Oracle development, AI for databases, PL/SQL workflows, and the local-first developer toolchain. Two posts per week."
  path="/blog"
  image="/datamap-hero.png"
  imageAlt="Veesker blog — Oracle, AI, and developer tools"
/>

<ScrollReveal>
  <section class="hero">
    <div class="container">
      <div class="eyebrow">Blog</div>
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
      </div>
    </div>
  </section>
</ScrollReveal>

{#if allTags().length > 0}
  <section class="topics" aria-label="Filter by topic">
    <div class="container">
      <div class="topics-row">
        <span class="topics-label">{lang === "pt" ? "Tópicos:" : "Topics:"}</span>
        <button
          class="topic-chip"
          class:active={activeTag === null}
          onclick={() => setTag(null)}
        >
          {lang === "pt" ? "Todos" : "All"}
          <span class="chip-count">{postsForLang.length}</span>
        </button>
        {#each allTags() as [tag, count] (tag)}
          <button
            class="topic-chip"
            class:active={activeTag === tag}
            onclick={() => setTag(activeTag === tag ? null : tag)}
          >
            #{tag}
            <span class="chip-count">{count}</span>
          </button>
        {/each}
      </div>
    </div>
  </section>
{/if}

<section class="posts">
  <div class="container">
    {#if filtered.length === 0}
      <div class="empty">
        {#if lang === "en"}
          No posts in this language yet. Check back Monday.
        {:else}
          Nenhum post em Português ainda. Volte na segunda.
        {/if}
      </div>
    {:else}
      <ScrollReveal stagger={0.08}>
        <ol class="post-list">
          {#each filtered as p (p.slug)}
            <TiltCard maxTilt={4}>
              <li class="post-card" use:spotlight>
                <a href="/blog/{p.slug}" class="post-link">
                  {#if p.hero}
                    <div class="post-hero-thumb">
                      <img src={p.hero} alt="" loading="lazy" />
                    </div>
                  {/if}
                  <div class="post-body">
                    <div class="post-meta">
                      <span class="post-date">{p.date}</span>
                      <span class="post-kind kind-{p.kind}">{kindLabel(p)}</span>
                      <span class="post-read">{readMinutes(p.words)} min read</span>
                    </div>
                    <h2>{p.title}</h2>
                    <p class="post-desc">{p.description}</p>
                    <div class="post-tags">
                      {#each p.tags as t}
                        <span class="tag" class:active-tag={t === activeTag}>#{t}</span>
                      {/each}
                    </div>
                  </div>
                </a>
              </li>
            </TiltCard>
          {/each}
        </ol>
      </ScrollReveal>
    {/if}
  </div>
</section>

<style>
  .hero {
    padding: 80px 0 24px;
    text-align: center;
  }
  .eyebrow {
    display: inline-block;
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #fdba74;
    background: rgba(249, 115, 22, 0.12);
    border: 1px solid rgba(249, 115, 22, 0.32);
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
    gap: 6px;
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

  .topics {
    padding: 18px 0 22px;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: rgba(20, 18, 15, 0.6);
  }
  .topics-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    max-width: 1080px;
    margin: 0 auto;
  }
  .topics-label {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-right: 4px;
  }
  .topic-chip {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    color: var(--text-muted);
    border-radius: 100px;
    padding: 5px 11px;
    font-size: 12.5px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: inherit;
    transition: border-color 0.14s ease, color 0.14s ease, background 0.14s ease;
  }
  .topic-chip:hover {
    color: var(--text);
    border-color: rgba(249, 115, 22, 0.4);
  }
  .topic-chip.active {
    background: rgba(249, 115, 22, 0.14);
    border-color: rgba(249, 115, 22, 0.6);
    color: #fdba74;
  }
  .chip-count {
    font-size: 10.5px;
    color: rgba(245, 241, 232, 0.45);
    font-family: "JetBrains Mono", monospace;
  }
  .topic-chip.active .chip-count {
    color: rgba(253, 186, 116, 0.7);
  }

  .posts {
    padding: 36px 0 80px;
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
    margin: 0 auto;
    max-width: 920px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .post-card {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 0.14s ease, transform 0.14s ease;
  }
  .post-card:hover {
    border-color: rgba(249, 115, 22, 0.4);
    transform: translateY(-2px);
  }
  .post-link {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 0;
    color: var(--text);
    text-decoration: none;
  }
  .post-link:hover {
    text-decoration: none;
  }
  .post-hero-thumb {
    position: relative;
    overflow: hidden;
    background: linear-gradient(170deg, rgba(40, 30, 24, 0.8), rgba(20, 16, 14, 0.9));
  }
  .post-hero-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .post-body {
    padding: 22px 26px;
  }
  .post-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 8px;
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
    background: rgba(253, 186, 116, 0.18);
    color: #fdba74;
    border: 1px solid rgba(249, 115, 22, 0.4);
  }
  .post-read {
    font-size: 11.5px;
    color: var(--text-muted);
  }
  .post-card h2 {
    font-size: 21px;
    line-height: 1.3;
    margin: 0 0 8px;
  }
  .post-desc {
    color: var(--text-muted);
    font-size: 13.5px;
    line-height: 1.6;
    margin: 0 0 12px;
  }
  .post-tags {
    display: flex;
    gap: 6px;
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
  .tag.active-tag {
    background: rgba(249, 115, 22, 0.15);
    color: #fdba74;
  }

  @media (max-width: 720px) {
    h1 { font-size: 30px; }
    .post-link {
      grid-template-columns: 1fr;
    }
    .post-hero-thumb {
      aspect-ratio: 1200 / 630;
    }
    .post-body { padding: 18px 20px; }
    .post-card h2 { font-size: 18px; }
  }
</style>
