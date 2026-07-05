import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fontDataUri(filename) {
  const bytes = fs.readFileSync(path.join(__dirname, "fonts", filename));
  return `data:font/woff2;base64,${bytes.toString("base64")}`;
}

const FONT_FILES = {
  anton: fontDataUri("Anton-latin.woff2"),
  inter: fontDataUri("Inter-latin.woff2"),
};

// Tokens extraídos por amostragem de pixel da referência enviada pelo usuário
// (headline preta/laranja, fundo branco, caixas pretas, cards com borda cinza clara).
export const TOKENS = {
  ink: "#0d0d0d",
  canvas: "#ffffff",
  accent: "#ff5a12",
  border: "#e3e3e3",
  onInkMuted: "rgba(255,255,255,0.7)",
  onInkRule: "rgba(255,255,255,0.25)",
  display: "'Anton', 'Arial Narrow', Impact, sans-serif",
  body: "'Inter', -apple-system, system-ui, Helvetica, Arial, sans-serif",
};

export function fontFaceCss() {
  return `
    @font-face {
      font-family: 'Anton';
      font-style: normal;
      font-weight: 400;
      src: url(${FONT_FILES.anton}) format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400 800;
      src: url(${FONT_FILES.inter}) format('woff2');
    }
  `;
}

// Marcação simples: **negrito** e {{destaque em laranja}}.
export function richText(str = "") {
  return str
    .replace(/\{\{(.+?)\}\}/g, `<span style="color:${TOKENS.accent}; font-weight:700;">$1</span>`)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function renderLines(lines = []) {
  return lines
    .map(
      (line) =>
        `<div class="headline-line">${line
          .map(
            (seg) =>
              `<span style="${seg.color === "accent" ? `color:${TOKENS.accent};` : ""}">${seg.text}</span>`
          )
          .join(" ")}</div>`
    )
    .join("");
}

// Ícones de linha desenhados do zero (não são cópia da referência) no mesmo espírito visual: traço, sem preenchimento.
const ICON_ATTRS = `viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
export const ICONS = {
  house: `<svg ${ICON_ATTRS}><path d="M9 32 L32 12 L55 32"/><path d="M16 29 V53 H48 V29"/><rect x="27" y="39" width="10" height="14"/><rect x="35" y="19" width="6" height="6" transform="rotate(45 38 22)"/></svg>`,
  car: `<svg ${ICON_ATTRS}><path d="M10 43 V35 Q10 31 14 31 H20 L26 21 H39 L45 31 H50 Q54 31 54 35 V43 Z"/><line x1="7" y1="43" x2="57" y2="43"/><circle cx="20" cy="43" r="5"/><circle cx="45" cy="43" r="5"/></svg>`,
  ball: `<svg ${ICON_ATTRS}><circle cx="32" cy="32" r="21"/><polygon points="32,21 41,28 37,39 27,39 23,28"/><line x1="32" y1="21" x2="32" y2="11"/><line x1="41" y1="28" x2="50" y2="23"/><line x1="37" y1="39" x2="42" y2="49"/><line x1="27" y1="39" x2="22" y2="49"/><line x1="23" y1="28" x2="14" y2="23"/></svg>`,
  briefcase: `<svg ${ICON_ATTRS}><rect x="9" y="24" width="46" height="29" rx="3"/><path d="M24 24 V18 Q24 14 28 14 H36 Q40 14 40 18 V24"/><line x1="9" y1="37" x2="55" y2="37"/><rect x="29" y="34" width="6" height="6"/></svg>`,
  injury: `<svg ${ICON_ATTRS}><path d="M20 12 L38 30 Q44 36 38 42 Q32 48 26 42 L8 24"/><line x1="16" y1="16" x2="24" y2="24"/><line x1="22" y1="10" x2="30" y2="18"/><line x1="12" y1="20" x2="10" y2="26"/><path d="M50 14 V52"/><path d="M42 14 H58"/><line x1="46" y1="26" x2="54" y2="26"/><line x1="46" y1="36" x2="54" y2="36"/><line x1="46" y1="46" x2="54" y2="46"/></svg>`,
  shieldCheck: `<svg ${ICON_ATTRS}><path d="M32 8 L54 16 V29 Q54 46 32 56 Q10 46 10 29 V16 Z"/><path d="M22 30 L29 38 L44 21"/></svg>`,
  calendarSlash: `<svg ${ICON_ATTRS}><rect x="9" y="14" width="46" height="41" rx="4"/><line x1="9" y1="27" x2="55" y2="27"/><line x1="20" y1="7" x2="20" y2="18"/><line x1="44" y1="7" x2="44" y2="18"/><line x1="12" y1="57" x2="53" y2="9"/></svg>`,
  instagram: `<svg ${ICON_ATTRS}><rect x="9" y="9" width="46" height="46" rx="13"/><circle cx="32" cy="32" r="12"/><circle cx="45" cy="19" r="1.5" fill="currentColor"/></svg>`,
};

export function baseCss() {
  return `
    ${fontFaceCss()}
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${TOKENS.canvas}; font-family: ${TOKENS.body}; }
    #canvas { width: 1080px; display: flex; flex-direction: column; gap: 44px; padding: 64px 64px 80px; }

    .headline-line {
      font-family: ${TOKENS.display};
      font-weight: 400;
      text-transform: uppercase;
      font-size: 74px;
      line-height: 1.02;
      color: ${TOKENS.ink};
      letter-spacing: -0.5px;
    }
    .hero-icon { color: ${TOKENS.ink}; width: 190px; height: 190px; flex-shrink: 0; }
    .subtitle {
      font-family: ${TOKENS.body};
      font-size: 26px;
      line-height: 1.5;
      color: ${TOKENS.ink};
    }
    .subtitle strong { font-weight: 700; }
    .law-pill {
      background: ${TOKENS.ink};
      color: ${TOKENS.canvas};
      border-radius: 8px;
      padding: 22px 28px;
      font-family: ${TOKENS.body};
      font-size: 22px;
      font-weight: 600;
      display: inline-block;
    }

    .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .grid-card {
      border: 1px solid ${TOKENS.border};
      border-radius: 14px;
      padding: 30px 24px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 14px;
    }
    .grid-icon { width: 52px; height: 52px; color: ${TOKENS.ink}; }
    .grid-divider { width: 100%; height: 1px; background: ${TOKENS.border}; }
    .grid-title {
      font-family: ${TOKENS.body};
      font-weight: 700;
      font-size: 21px;
      color: ${TOKENS.ink};
      line-height: 1.25;
    }
    .grid-desc {
      font-family: ${TOKENS.body};
      font-weight: 400;
      font-size: 17px;
      color: ${TOKENS.ink};
      line-height: 1.45;
    }

    .banner-block {
      background: ${TOKENS.ink};
      color: ${TOKENS.canvas};
      border-radius: 16px;
      padding: 40px;
      display: flex;
      align-items: center;
      gap: 28px;
    }
    .banner-icon { width: 56px; height: 56px; flex-shrink: 0; color: ${TOKENS.canvas}; }
    .banner-rule { width: 1px; align-self: stretch; background: ${TOKENS.onInkRule}; }
    .banner-content { flex: 1; display: flex; gap: 28px; align-items: center; }
    .banner-title { flex: 1.1; font-family: ${TOKENS.display}; font-size: 32px; line-height: 1.12; text-transform: uppercase; }
    .banner-title .headline-line { font-size: 32px; color: ${TOKENS.canvas}; }
    .banner-desc { flex: 1; font-family: ${TOKENS.body}; font-size: 18px; line-height: 1.5; color: ${TOKENS.onInkMuted}; }

    .note-block {
      border: 1px solid ${TOKENS.border};
      border-radius: 16px;
      padding: 32px;
      display: flex;
      align-items: center;
      gap: 26px;
    }
    .note-icon { width: 48px; height: 48px; flex-shrink: 0; color: ${TOKENS.ink}; }
    .note-text { font-family: ${TOKENS.body}; font-size: 19px; line-height: 1.5; color: ${TOKENS.ink}; }
    .note-text strong { font-weight: 700; }

    .footer-block { background: ${TOKENS.ink}; color: ${TOKENS.canvas}; border-radius: 16px; padding: 44px; }
    .footer-title { font-family: ${TOKENS.display}; font-size: 40px; text-transform: uppercase; line-height: 1.05; }
    .footer-rule { height: 1px; background: ${TOKENS.onInkRule}; margin: 24px 0; }
    .footer-subtitle { font-family: ${TOKENS.body}; font-size: 20px; margin-bottom: 22px; }
    .footer-handle { display: flex; align-items: center; gap: 12px; font-family: ${TOKENS.body}; font-weight: 600; font-size: 19px; }
    .footer-handle svg { width: 26px; height: 26px; }

    .page-pill {
      position: absolute;
      top: 40px;
      right: 40px;
      background: ${TOKENS.ink};
      color: ${TOKENS.canvas};
      font-family: ${TOKENS.body};
      font-weight: 700;
      font-size: 16px;
      padding: 8px 16px;
      border-radius: 999px;
    }
  `;
}

// Overrides usados só no carrossel (um bloco sozinho por slide 1080x1350):
// aumenta fontes/ícones/paddings e empilha banner/note na vertical, pra
// preencher melhor o quadro em vez de sobrar espaço em branco.
export function slideScaleCss() {
  return `
    .slide .headline-line { font-size: 118px; }
    .slide .hero-icon { width: 320px; height: 320px; }
    .slide .subtitle { font-size: 36px; }
    .slide .law-pill { font-size: 30px; padding: 32px 36px; }

    .slide .grid-card { padding: 40px; gap: 24px; min-height: 420px; justify-content: center; }
    .slide .grid-icon { width: 84px; height: 84px; }
    .slide .grid-title { font-size: 29px; }
    .slide .grid-desc { font-size: 23px; }
    .slide .grid-2col { gap: 32px; }

    .slide .banner-block { flex-direction: column; text-align: center; padding: 64px; gap: 40px; min-height: 920px; justify-content: center; }
    .slide .banner-icon { width: 120px; height: 120px; }
    .slide .banner-rule { width: 80px; height: 2px; align-self: center; }
    .slide .banner-content { flex: none; flex-direction: column; gap: 36px; }
    .slide .banner-title, .slide .banner-desc { flex: none; }
    .slide .banner-title .headline-line { font-size: 68px; }
    .slide .banner-desc { font-size: 30px; }

    .slide .note-block { flex-direction: column; text-align: center; padding: 64px; gap: 36px; min-height: 920px; justify-content: center; }
    .slide .note-icon { width: 108px; height: 108px; }
    .slide .note-text { font-size: 32px; }

    .slide .footer-block { padding: 64px; min-height: 920px; display: flex; flex-direction: column; justify-content: center; }
    .slide .footer-title { font-size: 84px; }
    .slide .footer-rule { margin: 40px 0; }
    .slide .footer-subtitle { font-size: 32px; margin-bottom: 32px; }
    .slide .footer-handle { font-size: 28px; }
    .slide .footer-handle svg { width: 36px; height: 36px; }
  `;
}

export function renderHero(block) {
  return `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:24px;">
      <div style="flex:1;">${renderLines(block.title)}</div>
      ${block.icon ? `<div class="hero-icon">${ICONS[block.icon] ?? ""}</div>` : ""}
    </div>
    ${block.subtitle ? `<p class="subtitle">${richText(block.subtitle)}</p>` : ""}
    ${
      block.lawCitation
        ? `<div class="law-pill">${block.lawCitation.text} <span style="color:${TOKENS.accent};">${block.lawCitation.highlight}</span></div>`
        : ""
    }
  `;
}

export function renderGrid(block) {
  const items = block.items
    .map(
      (item) => `
      <div class="grid-card">
        <div class="grid-icon">${ICONS[item.icon] ?? ""}</div>
        <div class="grid-divider"></div>
        <div class="grid-title">${item.title}</div>
        <div class="grid-desc">${richText(item.description)}</div>
      </div>
    `
    )
    .join("");
  return `<div class="grid-2col">${items}</div>`;
}

export function renderBanner(block) {
  return `
    <div class="banner-block">
      <div class="banner-icon">${ICONS[block.icon] ?? ""}</div>
      <div class="banner-rule"></div>
      <div class="banner-content">
        <div class="banner-title">${renderLines(block.title)}</div>
        <div class="banner-desc">${richText(block.description)}</div>
      </div>
    </div>
  `;
}

export function renderNote(block) {
  return `
    <div class="note-block">
      <div class="note-icon">${ICONS[block.icon] ?? ""}</div>
      <div class="note-text">${richText(block.text)}</div>
    </div>
  `;
}

export function renderFooter(block) {
  return `
    <div class="footer-block">
      <div class="footer-title">${block.title}</div>
      <div class="footer-rule"></div>
      <div class="footer-subtitle">${richText(block.subtitle)}</div>
      <div class="footer-handle">${ICONS.instagram} ${block.handle}</div>
    </div>
  `;
}

export function renderBlock(block) {
  switch (block.type) {
    case "hero":
      return renderHero(block);
    case "grid":
      return renderGrid(block);
    case "banner":
      return renderBanner(block);
    case "note":
      return renderNote(block);
    case "footer":
      return renderFooter(block);
    default:
      throw new Error(`Tipo de bloco desconhecido: ${block.type}`);
  }
}
