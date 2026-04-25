import sharp from "sharp";
import { readFileSync } from "node:fs";

const logoPath = "static/veesker-logo.png";
const outPath = "static/og-image.png";

const logoBuffer = await sharp(logoPath)
  .resize(320, 320, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="50%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#2a1814" stop-opacity="1"/>
      <stop offset="100%" stop-color="#0e0c0a" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e8643a"/>
      <stop offset="100%" stop-color="#b33e1f"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="4" fill="url(#accent)"/>
  <text x="440" y="265" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="92" font-weight="800" fill="#ffffff" letter-spacing="-2">Veesker</text>
  <text x="440" y="335" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="32" font-weight="500" fill="#cfc4bb">The Oracle 23ai studio for</text>
  <text x="440" y="378" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="32" font-weight="500" fill="#cfc4bb">SQL, AI, vectors, and APIs.</text>
  <g transform="translate(440 432)">
    <rect x="0" y="0" width="120" height="32" rx="16" fill="rgba(232,100,58,0.15)" stroke="#e8643a" stroke-width="1"/>
    <text x="60" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="700" fill="#e8643a" text-anchor="middle" letter-spacing="1">OPEN SOURCE</text>
  </g>
  <text x="580" y="453" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="600" fill="#9b9088" letter-spacing="1.5">APACHE 2.0 · TAURI · SVELTE 5</text>
  <text x="440" y="540" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="20" font-weight="500" fill="#7d7268">veesker.cloud</text>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: logoBuffer, left: 80, top: 155 }])
  .png({ compressionLevel: 9, quality: 92 })
  .toFile(outPath);

const meta = await sharp(outPath).metadata();
console.log(`✓ Generated ${outPath} (${meta.width}x${meta.height}, ${meta.size} bytes)`);
