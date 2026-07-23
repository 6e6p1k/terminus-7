import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'static');
mkdirSync(outDir, { recursive: true });

const BG = '#07070c';
const CYAN = '#22e6ff';
const MAG = '#ff37c7';

function iconSvg(size, { maskable = false } = {}) {
	const pad = maskable ? size * 0.18 : size * 0.08;
	const inner = size - pad * 2;
	const fontSize = Math.round(inner * 0.42);
	const subSize = Math.round(inner * 0.22);
	const cx = size / 2;
	const cy = size / 2 - size * 0.02;
	const corner = Math.round(size * 0.06);
	const stroke = Math.max(2, Math.round(size * 0.018));

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" fill="none"
    stroke="${CYAN}" stroke-width="${stroke}"
    pathLength="100"/>
  <!-- corner accents -->
  <path d="M${pad} ${pad + corner} V${pad} H${pad + corner}" fill="none" stroke="${MAG}" stroke-width="${stroke * 1.4}" stroke-linecap="square"/>
  <path d="M${size - pad - corner} ${pad} H${size - pad} V${pad + corner}" fill="none" stroke="${MAG}" stroke-width="${stroke * 1.4}" stroke-linecap="square"/>
  <path d="M${pad} ${size - pad - corner} V${size - pad} H${pad + corner}" fill="none" stroke="${MAG}" stroke-width="${stroke * 1.4}" stroke-linecap="square"/>
  <path d="M${size - pad - corner} ${size - pad} H${size - pad} V${size - pad - corner}" fill="none" stroke="${MAG}" stroke-width="${stroke * 1.4}" stroke-linecap="square"/>
  <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
    font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-weight="700"
    font-size="${fontSize}" fill="${CYAN}" letter-spacing="${Math.round(size * 0.01)}">T7</text>
  <text x="${cx}" y="${cy + fontSize * 0.72}" text-anchor="middle" dominant-baseline="central"
    font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-weight="600"
    font-size="${subSize}" fill="${MAG}" letter-spacing="${Math.round(size * 0.04)}">TERM</text>
</svg>`;
}

const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${BG}"/>
  <rect x="2" y="2" width="28" height="28" fill="none" stroke="${CYAN}" stroke-width="1.5"/>
  <path d="M2 8 V2 H8" fill="none" stroke="${MAG}" stroke-width="2"/>
  <path d="M24 2 H30 V8" fill="none" stroke="${MAG}" stroke-width="2"/>
  <path d="M2 24 V30 H8" fill="none" stroke="${MAG}" stroke-width="2"/>
  <path d="M24 30 H30 V24" fill="none" stroke="${MAG}" stroke-width="2"/>
  <text x="16" y="18" text-anchor="middle" dominant-baseline="central"
    font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-weight="700"
    font-size="12" fill="${CYAN}">T7</text>
</svg>`;

async function writePng(name, svg) {
	const buf = await sharp(Buffer.from(svg)).png().toBuffer();
	writeFileSync(join(outDir, name), buf);
	console.log('wrote', name, buf.length, 'bytes');
}

await writePng('icon-192.png', iconSvg(192));
await writePng('icon-512.png', iconSvg(512));
await writePng('icon-512-maskable.png', iconSvg(512, { maskable: true }));
await writePng('apple-touch-icon.png', iconSvg(180));
writeFileSync(join(outDir, 'favicon.svg'), faviconSvg);
console.log('wrote favicon.svg');
