import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 1080;
const HEIGHT = 1350;

function fontDataUri(filename) {
  const bytes = fs.readFileSync(path.join(__dirname, "fonts", filename));
  return `data:font/woff2;base64,${bytes.toString("base64")}`;
}

const FONT_FILES = {
  playfair: fontDataUri("PlayfairDisplay-latin.woff2"),
  playfairItalic: fontDataUri("PlayfairDisplay-Italic-latin.woff2"),
  lora: fontDataUri("Lora-latin.woff2"),
};

// Tokens do estilo "editorial elegante": serifada, paleta sóbria (creme/tinta/terracota).
const TOKENS = {
  cream: "#f7f4ee",
  ink: "#1c1a17",
  inkSoft: "#3a352c",
  accent: "#a6462c",
  creamMuted: "rgba(247, 244, 238, 0.7)",
  rule: "#d8d2c4",
  ruleOnDark: "rgba(247, 244, 238, 0.25)",
  serif: "'Playfair Display', Georgia, 'Times New Roman', ui-serif, serif",
  serifBody: "'Lora', Georgia, 'Times New Roman', ui-serif, serif",
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

function pad(n) {
  return String(n).padStart(2, "0");
}

function baseStyles() {
  return `
    @font-face {
      font-family: 'Playfair Display';
      font-style: normal;
      font-weight: 400 700;
      src: url(${FONT_FILES.playfair}) format('woff2');
    }
    @font-face {
      font-family: 'Playfair Display';
      font-style: italic;
      font-weight: 400;
      src: url(${FONT_FILES.playfairItalic}) format('woff2');
    }
    @font-face {
      font-family: 'Lora';
      font-style: normal;
      font-weight: 400 500;
      src: url(${FONT_FILES.lora}) format('woff2');
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
    }
    .slide {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 80px;
      position: relative;
      overflow: hidden;
    }
    .frame {
      position: absolute;
      inset: 36px;
      border: 1px solid var(--rule-color, ${TOKENS.rule});
      pointer-events: none;
    }
    .kicker {
      font-family: ${TOKENS.sans};
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: ${TOKENS.accent};
    }
    .kicker-rule {
      width: 64px;
      height: 2px;
      background: ${TOKENS.accent};
      margin-top: 16px;
    }
    .watermark {
      position: absolute;
      top: -60px;
      right: -20px;
      font-family: ${TOKENS.serif};
      font-size: 460px;
      font-weight: 700;
      color: ${TOKENS.accent};
      opacity: 0.08;
      line-height: 1;
      user-select: none;
    }
    .title-serif {
      font-family: ${TOKENS.serif};
      font-weight: 700;
    }
    .body-serif {
      font-family: ${TOKENS.serifBody};
      font-size: 30px;
      line-height: 1.65;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 24px;
      border-top: 1px solid var(--rule-color, ${TOKENS.rule});
      font-family: ${TOKENS.sans};
      font-size: 18px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .footer-mark {
      width: 10px;
      height: 10px;
      background: ${TOKENS.accent};
    }
  `;
}

function coverSlideHtml(slide, total) {
  return `
    <div class="slide" style="background:${TOKENS.ink}; color:${TOKENS.cream}; --rule-color:${TOKENS.ruleOnDark};">
      <div class="frame"></div>
      <div>
        <div class="kicker">${slide.eyebrow ?? "confira"}</div>
        <div class="kicker-rule"></div>
      </div>
      <div>
        <h1 class="title-serif" style="font-size:76px; line-height:1.08; letter-spacing:-1px;">
          ${slide.title}
        </h1>
        ${slide.subtitle ? `<p class="title-serif" style="margin-top:28px; font-size:28px; font-weight:400; font-style:italic; color:${TOKENS.creamMuted};">${slide.subtitle}</p>` : ""}
      </div>
      <div class="footer" style="color:${TOKENS.creamMuted};">
        <span>${pad(1)} — ${pad(total)}</span>
        <span class="footer-mark"></span>
      </div>
    </div>
  `;
}

function tipSlideHtml(slide, index, total) {
  return `
    <div class="slide" style="background:${TOKENS.cream}; color:${TOKENS.ink};">
      <div class="frame"></div>
      <div class="watermark">${pad(slide.number)}</div>
      <div>
        <div class="kicker">Dica nº ${pad(slide.number)}</div>
        <div class="kicker-rule"></div>
      </div>
      <div>
        <h2 class="title-serif" style="font-size:46px; line-height:1.2; margin-bottom:28px;">
          ${slide.title}
        </h2>
        <p class="body-serif" style="color:${TOKENS.inkSoft};">
          ${slide.body}
        </p>
      </div>
      <div class="footer" style="color:${TOKENS.inkSoft};">
        <span>${pad(index + 1)} — ${pad(total)}</span>
        <span class="footer-mark"></span>
      </div>
    </div>
  `;
}

function ctaSlideHtml(slide, index, total) {
  return `
    <div class="slide" style="background:${TOKENS.ink}; color:${TOKENS.cream}; --rule-color:${TOKENS.ruleOnDark};">
      <div class="frame"></div>
      <div>
        <div class="kicker">${slide.handle ?? "obrigado por ler"}</div>
        <div class="kicker-rule"></div>
      </div>
      <div>
        <h2 class="title-serif" style="font-size:52px; line-height:1.2; margin-bottom:28px;">
          ${slide.title}
        </h2>
        <p class="body-serif" style="color:${TOKENS.creamMuted};">
          ${slide.body}
        </p>
      </div>
      <div class="footer" style="color:${TOKENS.creamMuted};">
        <span>${pad(index + 1)} — ${pad(total)}</span>
        <span class="footer-mark"></span>
      </div>
    </div>
  `;
}

function renderSlide(slide, index, total, handle) {
  let body;
  if (slide.type === "cover") {
    body = coverSlideHtml(slide, total);
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
