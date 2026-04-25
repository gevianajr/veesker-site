# Veesker Site (veesker.dev)

Public marketing site for Veesker.

> Built with SvelteKit + static adapter, deployable to Cloudflare Pages, Netlify, or Vercel.

## Pages

- `/` — Home: hero, what it is, key features, CTA download
- `/features` — Detailed feature tour with screenshots
- `/pricing` — Subscription tiers + add-ons (mirrors `docs/PRICING.md` from open repo)
- `/docs` — Quick links to GitHub docs (CONTRIBUTING, SECURITY, etc.)
- `/download` — Latest release binaries (Windows / macOS) + checksums
- `/contact` — Sales / support / community

## Local development

```bash
bun install
bun run dev    # http://localhost:5173
```

## Build

```bash
bun run build  # outputs to ./build (static)
```

Deploy `./build/` to any static host. Recommended: Cloudflare Pages with `bun run build` as build command.

## License

Site content is licensed CC BY-SA 4.0 (article-style — share + modify).
Site code is MIT.
