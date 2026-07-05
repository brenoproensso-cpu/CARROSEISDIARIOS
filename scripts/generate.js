import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { baseCss, renderBlock, slideScaleCss } from "./juridico.js";

const WIDTH = 1080;
const HEIGHT = 1350;

function buildSlideHtml(block, index, total) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      ${baseCss()}
      ${slideScaleCss()}
      html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
      #canvas {
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        justify-content: center;
        position: relative;
      }
    </style>
  </head>
  <body>
    <div id="canvas" class="slide">
      <div class="page-pill">${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</div>
      ${renderBlock(block)}
    </div>
  </body>
</html>`;
}

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Uso: npm run generate -- content/<arquivo>.json");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const outDir = path.join("output", path.basename(inputPath, ".json"));
  fs.mkdirSync(outDir, { recursive: true });

  const preinstalledChromium = "/opt/pw-browsers/chromium";
  const launchOptions = fs.existsSync(preinstalledChromium)
    ? { executablePath: preinstalledChromium }
    : {};
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });

  for (let i = 0; i < data.blocks.length; i++) {
    const html = buildSlideHtml(data.blocks[i], i, data.blocks.length);
    await page.setContent(html, { waitUntil: "networkidle" });
    const filename = path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
    await page.screenshot({ path: filename });
    console.log(`Gerado: ${filename}`);
  }

  await browser.close();
  console.log(`\nPronto! ${data.blocks.length} slides em ${outDir}/`);
}

main();
