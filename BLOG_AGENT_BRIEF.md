# Veesker Blog — autonomous agent brief

This file is the source of truth for the weekly blog routine. Edit it freely — the routine reads it on every run.

## Cadence

- **Monday 09:00 BRT** → deep-dive (1000–1500 words, technical, code samples welcome)
- **Thursday 09:00 BRT** → manifesto / opinion (300–500 words, sharp take, single argument)

Each post ships in **EN + PT-BR** simultaneously. Two markdown files per run.

## Hard rules

1. **Never invent technical claims.** If you don't know whether Oracle 23ai supports something, say "in development" or skip it. Don't make up benchmarks, customer counts, or feature dates.
2. **Stay on-brand:** local-first, open-source core, Apache 2.0, $29 USD/seat/month Cloud (single tier), founder pricing locked for waitlist members, Cloud GA H2 2026.
3. **Voice:** confident-but-honest, technical, slightly opinionated. No hype, no breathless adjectives, no "revolutionary".
4. **Always close with one CTA.** Either `/download`, `/#waitlist`, or `/blog`.
5. **No emojis in body copy.** Headings allowed only if essential. Frontmatter has none.
6. **Always sign off** as `— *Geraldo Viana, founder of Veesker*` (or PT equivalent).

## Frontmatter schema (mandatory)

```yaml
---
title: "..."
description: "One sentence ≤200 chars summarizing the takeaway."
date: "YYYY-MM-DD"  # use today's date in BRT
slug: "kebab-case-slug"
lang: "en"          # or "pt"
kind: "deep-dive"   # or "manifesto"
tags: ["oracle", "..."]   # 2-5 tags, lowercase, kebab-case
translation_slug: "matching-slug-in-other-lang"
read_minutes: 7     # honest estimate (200 words/min)
---
```

The `slug` and `translation_slug` cross-reference the EN↔PT pair. Always set both.

## File naming

`src/posts/YYYY-MM-DD-<slug>.md` — date prefix matters (sort).

Pair example:
- `2026-05-11-schema-aware-ai-vs-generic-llm.md` (lang: en)
- `2026-05-11-ia-com-schema-vs-llm-generico.md` (lang: pt)

## Topic queue (refill as you write)

Strike through used topics by replacing `[ ]` with `[x]` in this file at end of each run.

### Deep-dives (Monday)

- [x] Oracle 9i to 26ai in one binary — Thick mode auto-discovery explained
- [ ] Schema-aware AI: why generic LLMs fail at PL/SQL (CONNECT BY, MERGE, hints, bind vars)
- [ ] Sharing production data without leaking it: VeeskerDB Sandbox internals (X25519 + ChaCha20)
- [ ] Migrating legacy PL/SQL packages to APEX 24.x — a field guide
- [ ] EXPLAIN PLAN as a feedback loop for AI tuning
- [ ] Building Oracle 23ai vector RAG: from embeddings to ORDS endpoints
- [ ] Why we picked Tauri 2 over Electron for an Oracle IDE
- [ ] Per-connection safety: env tags, read-only mode, statement timeouts, unsafe-DML guards
- [ ] Auto-documenting 1000 PL/SQL packages overnight — design notes
- [ ] Bind variables vs string concatenation: still relevant in the LLM era

### Manifestos (Thursday)

- [ ] Local-first developer tools: a manifesto for Oracle teams
- [ ] The Oracle DBA is not going extinct, they are getting tools worthy of the job
- [ ] Why "AI for SQL" is mostly a UX problem, not a model problem
- [ ] Stop asking your LLM to invent schemas. Ground it.
- [ ] The case against subscription-only IDEs in 2026
- [ ] Open-source as a hiring filter: build the tool the senior dev would download
- [ ] You don't have a query problem, you have a context problem
- [ ] What "good" looks like for a database IDE in 2026

## Where to ground

Read these before drafting:
- `CLAUDE.md` (root and per-repo) — voice, conventions
- `~/.claude/projects/C--Users-geefa-Documents-veesker-project/memory/MEMORY.md` — recent activity, decisions
- `git log --oneline -30` in `ce/`, `cl/`, `api/` — what shipped lately
- `https://github.com/veesker-cloud/veesker-community-edition/releases` — public version line

## Publish checklist (every run)

1. `cd C:\Users\geefa\Documents\veesker-project\site`
2. Pull latest: `git pull origin main`
3. Read this file + topic queue. Pick one unchecked topic of the right kind.
4. Write EN markdown to `src/posts/YYYY-MM-DD-<en-slug>.md`.
5. Write PT-BR translation to `src/posts/YYYY-MM-DD-<pt-slug>.md`. Match content beat-for-beat — translate, don't paraphrase the *content*; do localize idioms.
6. Update this file: tick the topic with `[x]`. Optionally add new ideas to the queue.
7. `bun run build` — must succeed.
8. Smoke check: post URLs return 200 in `bun run preview`.
9. `git add -A && git commit -m "post(blog): <title> (EN+PT)"` — single commit, both files.
10. `git push origin main`.
11. `npx wrangler deploy` from `site/`.
12. Verify `https://veesker.cloud/blog/<slug>` returns 200 with the new title.

## Failure handling

- If `bun run build` fails: do NOT commit. Investigate, fix, retry. Never ship broken markdown.
- If `git push` fails: pull, rebase, retry once. If still failing, abort and surface the error — do not force-push.
- If `wrangler deploy` fails: the GitHub commit is still useful (revert via `wrangler rollback` is available). Surface the error.
- If you cannot pick a topic (all checked, no queue refill): write a short retrospective post on the most recent shipped feature instead, and DO refill the queue before exiting.

## Tone reference

Read `src/posts/2026-05-04-why-we-built-another-oracle-ide.md` for the canonical voice. New posts should sound like a continuation of that one.
