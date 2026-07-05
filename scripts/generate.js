import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const WIDTH = 1080;
const HEIGHT = 1350;

// Tokens extraídos de DESIGN.md (Notion). Ver DESIGN.md para a fonte completa.
const TOKENS = {
  primary: "#5645d4",
  brandNavy: "#0a1530",
  ink: "#1a1a1a",
  charcoal: "#37352f",
  slate: "#5d5b54",
  canvas: "#ffffff",
  hairline: "#e5e3df",
  onDark: "#ffffff",
  tints: {
    peach: "#ffe8d4",
    rose: "#fde0ec",
    mint: "#d9f3e1",
    lavender: "#e6e0f5",
    sky: "#dcecfa",
    yellowBold: "#f9e79f",
  },
  font: "Inter, -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
  radiusMd: "8px",
  radiusLg: "12px",
  radiusFull: "9999px",
};

const TINT_ORDER = ["peach", "mint", "sky", "lavender", "rose"];

function baseStyles() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      font-family: ${TOKENS.font};
    }
    .slide {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 72px;
      position: relative;
    }
    .dots {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: ${TOKENS.radiusFull};
      background: rgba(0,0,0,0.15);
    }
    .dot.active { background: ${TOKENS.primary}; width: 28px; border-radius: ${TOKENS.radiusFull}; }
    .dot.active.on-dark { background: ${TOKENS.onDark}; }
    .dot.on-dark { background: rgba(255,255,255,0.3); }
    .badge {
      display: inline-flex;
      align-items: center;
      align-self: flex-start;
      background: ${TOKENS.primary};
      color: ${TOKENS.onDark};
      font-weight: 600;
      font-size: 22px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 10px 22px;
      border-radius: ${TOKENS.radiusFull};
    }
    .number-badge {
      width: 88px;
      height: 88px;
      border-radius: ${TOKENS.radiusFull};
      background: ${TOKENS.primary};
      color: ${TOKENS.onDark};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: 700;
    }
  `;
}

function coverSlideHtml(slide) {
  return `
    <div class="slide" style="background:${TOKENS.brandNavy}; color:${TOKENS.onDark};">
      <div class="badge">${slide.eyebrow ?? "CONFIRA"}</div>
      <div>
        <h1 style="font-size:64px; font-weight:700; line-height:1.1; letter-spacing:-1.5px;">
          ${slide.title}
        </h1>
        ${slide.subtitle ? `<p style="margin-top:24px; font-size:30px; color:rgba(255,255,255,0.75);">${slide.subtitle}</p>` : ""}
      </div>
      <div class="dots">${dotsHtml(0, slide.__total, true)}</div>
    </div>
  `;
}

function tipSlideHtml(slide, index, total) {
  const tintKey = TINT_ORDER[(slide.number - 1) % TINT_ORDER.length];
  const bg = TOKENS.tints[slide.tint] ?? TOKENS.tints[tintKey];
  return `
    <div class="slide" style="background:${bg}; color:${TOKENS.charcoal};">
      <div class="number-badge">${slide.number}</div>
      <div>
        <h2 style="font-size:40px; font-weight:600; line-height:1.2; margin-bottom:24px;">
          ${slide.title}
        </h2>
        <p style="font-size:30px; line-height:1.5; color:${TOKENS.charcoal};">
          ${slide.body}
        </p>
      </div>
      <div class="dots">${dotsHtml(index, total, false)}</div>
    </div>
  `;
}

function ctaSlideHtml(slide, index, total) {
  return `
    <div class="slide" style="background:${TOKENS.tints.yellowBold}; color:${TOKENS.charcoal};">
      <div class="badge" style="background:${TOKENS.ink};">${slide.handle ?? ""}</div>
      <div>
        <h2 style="font-size:48px; font-weight:700; line-height:1.2; margin-bottom:24px;">
          ${slide.title}
        </h2>
        <p style="font-size:30px; line-height:1.5;">
          ${slide.body}
        </p>
      </div>
      <div class="dots">${dotsHtml(index, total, false)}</div>
    </div>
  `;
}

function dotsHtml(activeIndex, total, onDark) {
  const cls = onDark ? "on-dark" : "";
  return Array.from({ length: total })
    .map((_, i) => `<span class="dot ${cls} ${i === activeIndex ? "active" : ""}"></span>`)
    .join("");
}

function renderSlide(slide, index, total, handle) {
  let body;
  if (slide.type === "cover") {
    body = coverSlideHtml({ ...slide, __total: total });
  } else if (slide.type === "cta") {
    body = ctaSlideHtml({ ...slide, handle }, index, total);
  } else {
    body = tipSlideHtml(slide, index, total);
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>${baseStyles()}</style>
  </head>
  <body>${body}</body>
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

  for (let i = 0; i < data.slides.length; i++) {
    const html = renderSlide(data.slides[i], i, data.slides.length, data.handle);
    await page.setContent(html, { waitUntil: "networkidle" });
    const filename = path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
    await page.screenshot({ path: filename });
    console.log(`Gerado: ${filename}`);
  }

  await browser.close();
  console.log(`\nPronto! ${data.slides.length} slides em ${outDir}/`);
}

main();
