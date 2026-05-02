<script lang="ts">
  import Seo from "$lib/seo.svelte";

  type Release = {
    version: string;
    date: string;
    title: string;
    tag: "feature" | "fix" | "security" | "milestone";
    highlights: string[];
  };

  // Newest first. Manually curated — bumped on each meaningful release.
  const releases: Release[] = [
    {
      version: "v0.2.4",
      date: "2026-05-02",
      title: "VeeskerDB Sandbox — owner publish wizard + member open flow shipped",
      tag: "feature",
      highlights: [
        "Sandbox Plan 5b shipped: full owner-side publish wizard (Steps 1-5) and member-side open/query/close via local DuckDB.",
        "Multi-agent security review pass 2 (ultrathink): JWT identity refactored to Rust + sidecar, R2 SHA verification, replay defense, lookup throttling.",
        "Site refresh: new Cloud waitlist (real backend), competitive comparison, personas section, security page.",
      ],
    },
    {
      version: "v0.2.3",
      date: "2026-05-01",
      title: "Sandbox Plan 4 — member open flow + Plan 3 BYOC published",
      tag: "feature",
      highlights: [
        "Member-side open / query / close via DuckDB local (engine 143 + sidecar 346 tests).",
        "Sandbox publish/pull pivoted to Veesker-hosted via Cloudflare R2 (BYOC cancelled — simpler ops).",
        "api.veesker.cloud went LIVE (Cloudflare Pages → Railway).",
        "12 commits across CE + CL + API.",
      ],
    },
    {
      version: "v0.2.2",
      date: "2026-04-30",
      title: "Comprehensive security audit — 16 findings resolved",
      tag: "security",
      highlights: [
        "16 findings across credential storage, SQL safety, audit logging, error reflection.",
        "Migrations 004-006 hardened the auth/audit path.",
        "Resolved across 4 batches + ultrareview pass.",
        "Production now matches DBeaver EE security posture.",
      ],
    },
    {
      version: "v0.2.1",
      date: "2026-04-26",
      title: "Per-connection safety milestone + free security CI",
      tag: "milestone",
      highlights: [
        "Four per-connection safety guards: env tags, read-only mode, statement timeouts, unsafe-DML confirmations.",
        "Dependabot, CodeQL, OSV-Scanner CI added on the open repo.",
        "New Tauri updater signing key (Ed25519).",
      ],
    },
    {
      version: "v0.2.0",
      date: "2026-04-25",
      title: "First public release — veesker.cloud LIVE",
      tag: "milestone",
      highlights: [
        "Windows installer with built-in auto-updater shipped.",
        "Marketing site veesker.cloud + www LIVE on Cloudflare.",
        "18 ultra-review fixes shipped before go-live.",
        "SaaS architecture spec + plan committed (app.veesker.cloud build path).",
      ],
    },
  ];

  function tagLabel(t: Release["tag"]): string {
    return { feature: "Feature", fix: "Fix", security: "Security", milestone: "Milestone" }[t];
  }
</script>

<Seo
  title="Changelog"
  description="What shipped in Veesker recently. Releases, security updates, and milestones."
  path="/changelog"
  image="/datamap-hero.png"
  imageAlt="Veesker recent shipped milestones"
/>

<section class="hero">
  <div class="container">
    <div class="eyebrow">What shipped recently</div>
    <h1>Changelog.</h1>
    <p class="lead">
      Veesker ships in public. Every release, security fix, and milestone is announced here and on the
      <a href="https://github.com/veesker-cloud/veesker-community-edition/releases" target="_blank" rel="noopener">GitHub releases page</a>.
    </p>
  </div>
</section>

<section class="releases">
  <div class="container">
    <ol class="release-list">
      {#each releases as r (r.version)}
        <li class="release {r.tag}">
          <div class="release-meta">
            <span class="release-version">{r.version}</span>
            <span class="release-date">{r.date}</span>
            <span class="release-tag tag-{r.tag}">{tagLabel(r.tag)}</span>
          </div>
          <h2 class="release-title">{r.title}</h2>
          <ul class="release-highlights">
            {#each r.highlights as line}
              <li>{line}</li>
            {/each}
          </ul>
        </li>
      {/each}
    </ol>

    <div class="more">
      <p>
        Looking for older releases? See the
        <a href="https://github.com/veesker-cloud/veesker-community-edition/releases" target="_blank" rel="noopener">full release archive on GitHub</a>.
      </p>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: 80px 0 40px;
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
    font-size: 48px;
    margin: 0 0 18px;
    letter-spacing: -0.02em;
  }
  .lead {
    color: var(--text-muted);
    font-size: 17px;
    line-height: 1.65;
    max-width: 740px;
    margin: 0 auto;
  }
  .lead a {
    color: var(--accent-text);
  }

  .releases {
    padding: 30px 0 80px;
  }
  .release-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .release {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 26px 28px;
    border-left-width: 4px;
  }
  .release.feature {
    border-left-color: rgba(138, 216, 251, 0.55);
  }
  .release.fix {
    border-left-color: #b6f0c1;
  }
  .release.security {
    border-left-color: #ff9f7a;
  }
  .release.milestone {
    border-left-color: #f7b49f;
  }
  .release-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .release-version {
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    background: rgba(245, 241, 232, 0.06);
    border: 1px solid var(--border);
    padding: 3px 10px;
    border-radius: 6px;
  }
  .release-date {
    font-size: 12px;
    color: var(--text-muted);
    font-family: "JetBrains Mono", monospace;
    letter-spacing: 0.04em;
  }
  .release-tag {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 3px 9px;
    border-radius: 100px;
  }
  .tag-feature {
    background: rgba(43, 180, 238, 0.18);
    color: #b9ebff;
    border: 1px solid rgba(138, 216, 251, 0.4);
  }
  .tag-fix {
    background: rgba(102, 217, 137, 0.16);
    color: #b6f0c1;
    border: 1px solid rgba(102, 217, 137, 0.4);
  }
  .tag-security {
    background: rgba(255, 159, 122, 0.18);
    color: #ffb89c;
    border: 1px solid rgba(255, 159, 122, 0.4);
  }
  .tag-milestone {
    background: rgba(247, 180, 159, 0.18);
    color: #f7b49f;
    border: 1px solid rgba(245, 160, 138, 0.4);
  }
  .release-title {
    font-size: 19px;
    line-height: 1.35;
    margin: 0 0 14px;
  }
  .release-highlights {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .release-highlights li {
    padding: 6px 0 6px 18px;
    color: var(--text-muted);
    font-size: 13.5px;
    line-height: 1.6;
    position: relative;
  }
  .release-highlights li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent-text);
  }

  .more {
    max-width: 860px;
    margin: 36px auto 0;
    text-align: center;
    color: var(--text-muted);
    font-size: 14px;
  }
  .more a {
    color: var(--accent-text);
  }

  @media (max-width: 820px) {
    h1 {
      font-size: 36px;
    }
    .release {
      padding: 20px 20px;
    }
  }
</style>
