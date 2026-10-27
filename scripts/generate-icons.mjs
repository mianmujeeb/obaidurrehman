// Renders the brand mark (a kidney-bean glyph) into every PNG the PWA and
// favicons need. Run with: npm run icons
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ACCENT = "#0b6e6a";
const INK = "#f2fbfa";

// `scale` shrinks the glyph so maskable icons keep it inside the 80% safe zone.
function markSvg({ rounded, scale = 1 }) {
  const t = (1 - scale) * 256;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rounded ? 116 : 0}" fill="${ACCENT}"/>
  <g transform="translate(${t} ${t}) scale(${scale}) translate(-29 0)">
    <path d="M226 246 C 186 252, 160 286, 156 336 C 153 376, 162 410, 176 446" fill="none"
      stroke="${INK}" stroke-opacity="0.7" stroke-width="24" stroke-linecap="round"/>
    <path d="M300 70 C 392 70, 420 168, 414 246 C 408 334, 362 404, 286 404
      C 214 404, 178 360, 190 314 C 198 284, 236 274, 234 248
      C 232 222, 196 214, 188 182 C 176 124, 226 70, 300 70 Z" fill="${INK}"/>
  </g>
</svg>`;
}

const targets = [
  { file: "public/icons/icon-192.png", size: 192, rounded: true },
  { file: "public/icons/icon-512.png", size: 512, rounded: true },
  { file: "public/icons/maskable-512.png", size: 512, rounded: false, scale: 0.72 },
  { file: "src/app/icon.png", size: 96, rounded: true },
  { file: "src/app/apple-icon.png", size: 180, rounded: false, scale: 0.82 },
];

await mkdir(path.join(root, "public/icons"), { recursive: true });
for (const t of targets) {
  await sharp(Buffer.from(markSvg(t))).resize(t.size, t.size).png().toFile(path.join(root, t.file));
  console.log("wrote", t.file);
}
