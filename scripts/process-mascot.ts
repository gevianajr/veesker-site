import sharp from "sharp";
import { resolve } from "path";

const src = resolve(import.meta.dir, "../static/veesker-mascot.png");

await sharp(src)
  .webp({ quality: 90 })
  .toFile(resolve(import.meta.dir, "../static/veesker-mascot.webp"));

await sharp(src)
  .resize(480)
  .webp({ quality: 88 })
  .toFile(resolve(import.meta.dir, "../static/veesker-mascot-480.webp"));

await sharp(src)
  .resize(480)
  .avif({ quality: 72 })
  .toFile(resolve(import.meta.dir, "../static/veesker-mascot-480.avif"));

await sharp(src)
  .resize(960)
  .webp({ quality: 90 })
  .toFile(resolve(import.meta.dir, "../static/veesker-mascot-960.webp"));

await sharp(src)
  .resize(960)
  .avif({ quality: 72 })
  .toFile(resolve(import.meta.dir, "../static/veesker-mascot-960.avif"));

console.log("Mascot images generated.");
