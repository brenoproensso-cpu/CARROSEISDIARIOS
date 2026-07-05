# DESIGN.md — Jurídico (preto / branco / laranja)

> Estilo extraído por amostragem de cor e observação direta de uma referência enviada pelo usuário (post jurídico no Instagram). Os ícones são desenhados do zero no mesmo espírito de traço/linha da referência, não são cópia pixel a pixel dela.
> Mudar um valor aqui não altera o gerador automaticamente — os tokens estão duplicados como CSS em `scripts/juridico.js` para manter a geração de imagem sem dependências externas.

```yaml
colors:
  ink: "#0d0d0d"       # texto principal, fundo das caixas pretas (lei, banner, rodapé)
  canvas: "#ffffff"    # fundo da página
  accent: "#ff5a12"    # laranja — palavra de destaque no título, highlight na citação de lei
  border: "#e3e3e3"    # borda fina dos cards e da caixa de observação
  on-ink-muted: "rgba(255,255,255,0.7)"   # texto secundário sobre fundo preto
  on-ink-rule: "rgba(255,255,255,0.25)"   # linhas finas sobre fundo preto

typography:
  display: "Anton"      # títulos grandes em caixa alta (hero, banner, rodapé) — condensada, bem pesada
  body: "Inter"         # parágrafos, cards, citação de lei, kicker
  headline: { size: 74px, weight: 400 (Anton já é bold), transform: uppercase }
  subtitle: { size: 26px, weight: 400 }
  law-pill: { size: 22px, weight: 600 }
  grid-title: { size: 21px, weight: 700 }
  grid-desc: { size: 17px, weight: 400 }
  banner-title: { size: 32px, transform: uppercase }
  banner-desc: { size: 18px }
  footer-title: { size: 40px, transform: uppercase }

layout:
  canvas-carrossel: 1080x1350px   # um bloco por slide, centralizado verticalmente
  canvas-post: 1080px de largura, altura automática (todos os blocos empilhados)
  padding: 64px laterais
```

## Blocos disponíveis (`content/*.json` → `blocks: [...]`)

Cada item de `blocks` tem um `type` e vira um componente visual. Os mesmos blocos são usados tanto no post único (`generate:post`) quanto no carrossel (`generate`, um bloco por slide).

- **`hero`** — título grande (linhas com trechos coloríveis via `color: "accent"`), subtítulo, ícone opcional no canto superior direito, e citação de lei (caixa preta com trecho em laranja).
- **`grid`** — grade 2 colunas de cards (ícone + linha divisória + título + descrição). Use `items: [...]`.
- **`banner`** — faixa preta de destaque: ícone + título (2 linhas, 2ª geralmente laranja) + descrição.
- **`note`** — caixa com borda fina: ícone + texto (aceita `**negrito**`).
- **`footer`** — caixa preta de encerramento: título grande, linha, subtítulo, ícone do Instagram + `@handle`.

Texto em `subtitle`, `description`, `text` e `subtitle` do footer aceitam marcação simples:
- `**texto**` → negrito
- `{{texto}}` → negrito laranja (cor de destaque)

## Ícones

Ícones disponíveis em `ICONS` (`scripts/juridico.js`): `house`, `car`, `ball`, `briefcase`, `injury`, `shieldCheck`, `calendarSlash`, `instagram`. Para adicionar um novo, escreva um `<svg>` com `stroke="currentColor" fill="none"` no mesmo padrão dos existentes.

## Fontes

Anton e Inter (subset latin, cobre acentuação em português) ficam em `scripts/fonts/*.woff2`, embutidas como base64 — a geração funciona offline.
