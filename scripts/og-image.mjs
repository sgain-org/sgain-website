import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));

const W = 1200;
const H = 630;
const PAD = 80;

const serif = "Georgia, 'Times New Roman', serif";
const sans = "Helvetica, 'Helvetica Neue', Arial, sans-serif";

const logoW = 280;
const logoH = Math.round((logoW * 659) / 1216); // SGAIN_Logo_full_white.png is 1216x659

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2b4a64"/>
      <stop offset="0.55" stop-color="#406383"/>
      <stop offset="1" stop-color="#5b7a96"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>

  <text x="${PAD}" y="140" font-family="${sans}" font-size="30" font-weight="700"
        letter-spacing="6" fill="#d2e4f3">SGAIN</text>
  <rect x="${PAD}" y="162" width="120" height="4" rx="2" fill="#b06a3c"/>

  <text x="${PAD}" y="248" font-family="${serif}" font-size="60" font-weight="700"
        fill="#ffffff">Sustainability Governance</text>
  <text x="${PAD}" y="316" font-family="${serif}" font-size="60" font-weight="700"
        fill="#ffffff">of China&#8217;s Global</text>
  <text x="${PAD}" y="384" font-family="${serif}" font-size="60" font-weight="700"
        fill="#ffffff">Infrastructure Investments</text>

  <text x="${PAD}" y="452" font-family="${sans}" font-size="30" fill="#dce9f5">Cross-border environmental governance</text>
  <text x="${PAD}" y="492" font-family="${sans}" font-size="30" fill="#dce9f5">led by Chinese state and non-state actors</text>

  <text x="${PAD}" y="560" font-family="${sans}" font-size="24" fill="#c9dceb">SGAIN &#183; University of Bath</text>
</svg>`;

const logo = await sharp(`${root}public/logos/SGAIN_Logo_full_white.png`)
  .resize(logoW, logoH)
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: logo, left: W - PAD - logoW, top: H - PAD - logoH }])
  .png()
  .toFile(`${root}public/og-image.png`);

console.log(`Wrote public/og-image.png (${W}x${H})`);
