#!/usr/bin/env bun
// Generate a 1200×630 hero image for a blog post.
//
// Strategy: ask Pollinations.ai for a free generation (no API key needed),
// then composite the Veesker mascot onto the bottom-right corner via Sharp.
//
// Usage:
//   bun run scripts/generate-blog-image.ts "<slug>" "<title>" [seed]
//
// Output: static/blog/<slug>.png

import sharp from "sharp";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const slug = process.argv[2];
const title = process.argv[3];
const seed = process.argv[4] ?? String(slug?.length ?? 42);

if (!slug || !title) {
  console.error("usage: bun run scripts/generate-blog-image.ts <slug> <title> [seed]");
  process.exit(1);
}

const OUT_DIR = resolve(process.cwd(), "static", "blog");
const OUT_PATH = resolve(OUT_DIR, `${slug}.png`);
const LOGO_PATH = resolve(process.cwd(), "static", "veesker-master-logo.png");

mkdirSync(OUT_DIR, { recursive: true });

// Build a prompt that biases toward dark, technical, abstract — not literal scenes
// of code (Pollinations/SDXL renders code as gibberish that looks bad).
const styleSuffix =
  "abstract technical diagram, dark navy background, warm orange and cyan accents, clean minimalist composition, no text, no letters, no numbers, no human figures, vector style, depth";
const prompt = `${title} — ${styleSuffix}`;

const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&nologo=true&seed=${seed}&model=flux`;

console.log(`[blog-image] requesting: ${title}`);
console.log(`[blog-image] url       : ${url.slice(0, 140)}…`);

async function fetchWithRetry(u: string, max = 3): Promise<Buffer> {
  let lastErr: Error | null = null;
  for (let attempt = 1; attempt <= max; attempt++) {
    try {
      const res = await fetch(u, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const ab = await res.arrayBuffer();
      if (ab.byteLength < 4_000) throw new Error(`tiny payload (${ab.byteLength} bytes)`);
      return Buffer.from(ab);
    } catch (e) {
      lastErr = e as Error;
      console.warn(`[blog-image] attempt ${attempt}/${max} failed: ${lastErr.message}`);
      if (attempt < max) await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  throw lastErr ?? new Error("unknown fetch error");
}

const baseBuf = await fetchWithRetry(url);
console.log(`[blog-image] base image: ${baseBuf.length} bytes`);

// Resize the Veesker mascot (logo) to ~140px tall and pad it with a soft
// rounded backdrop so it stands out against any base image.
const logoSize = 140;
let logoBuf: Buffer;
if (existsSync(LOGO_PATH)) {
  const logoOnly = await sharp(LOGO_PATH)
    .resize({ height: logoSize, withoutEnlargement: true })
    .toBuffer();

  // Soft dark rounded chip behind the logo for legibility on any background.
  const padding = 20;
  const meta = await sharp(logoOnly).metadata();
  const w = (meta.width ?? logoSize) + padding * 2;
  const h = (meta.height ?? logoSize) + padding * 2;
  const chipSvg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect x="0" y="0" width="${w}" height="${h}" rx="20" ry="20"
        fill="rgba(10,10,10,0.7)" stroke="rgba(245,160,138,0.5)" stroke-width="2"/>
    </svg>
  `);
  logoBuf = await sharp(chipSvg)
    .composite([{ input: logoOnly, gravity: "center" }])
    .png()
    .toBuffer();
} else {
  console.warn(`[blog-image] logo not found at ${LOGO_PATH} — skipping overlay`);
  logoBuf = Buffer.alloc(0);
}

const composed = sharp(baseBuf);
if (logoBuf.length > 0) {
  composed.composite([
    {
      input: logoBuf,
      gravity: "southeast",
      // sharp's `top` and `left` only work with absolute positioning, but
      // gravity already places the logo in the corner. The chip's own padding
      // gives the breathing room.
    },
  ]);
}

const finalBuf = await composed.png({ compressionLevel: 9 }).toBuffer();
writeFileSync(OUT_PATH, finalBuf);

console.log(`[blog-image] wrote ${OUT_PATH} (${(finalBuf.length / 1024).toFixed(0)} KB)`);
