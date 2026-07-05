import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { baseCss, renderBlock } from "./juridico.js";

const WIDTH = 1080;

function buildHtml(data) {
  const blocksHtml = data.blocks.map((block) => renderBlock(block)).join("\n");
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>${baseCss()}</style>
  </head>
  <body>
    <div id="canvas">${blocksHtml}</div>
  </body>
</html>`;
}

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Uso: npm run generate:post -- content/<arquivo>.json");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const outDir = "output";
  fs.mkdirSync(outDir, { recursive: true });
  const filename = path.join(outDir, `${path.basename(inputPath, ".json")}.png`);

  const preinstalledChromium = "/opt/pw-browsers/chromium";
  const launchOptions = fs.existsSync(preinstalledChromium)
    ? { executablePath: preinstalledChromium }
    : {};
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 2400 } });

  await page.setContent(buildHtml(data), { waitUntil: "networkidle" });
  await page.locator("#canvas").screenshot({ path: filename });

  await browser.close();
  console.log(`Pronto! Post gerado em ${filename}`);
}

main();
