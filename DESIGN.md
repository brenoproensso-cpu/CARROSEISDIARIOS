# DESIGN.md — Notion (adaptado para carrosséis)

> Fonte original: [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — `design-md/notion/DESIGN.md`.
> Este arquivo traz os tokens usados pelo gerador em `scripts/generate.js`. Mudar um valor aqui não altera o gerador automaticamente — os tokens estão duplicados como CSS em `scripts/generate.js` para manter a geração de imagem sem dependências externas.

```yaml
colors:
  primary: "#5645d4"        # roxo Notion — usar em badges/destaques, nunca em texto corrido
  brand-navy: "#0a1530"     # fundo da capa
  ink: "#1a1a1a"            # texto principal
  charcoal: "#37352f"       # texto sobre fundos coloridos (tints)
  slate: "#5d5b54"          # texto secundário
  canvas: "#ffffff"
  surface: "#f6f5f4"
  hairline: "#e5e3df"
  on-dark: "#ffffff"
  tint-peach: "#ffe8d4"
  tint-rose: "#fde0ec"
  tint-mint: "#d9f3e1"
  tint-lavender: "#e6e0f5"
  tint-sky: "#dcecfa"
  tint-yellow-bold: "#f9e79f"

typography:
  fontFamily: "Inter, -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif"  # fallback documentado do Notion Sans
  cover-title: { size: 64px, weight: 700, lineHeight: 1.1, letterSpacing: -1.5px }
  tip-title:   { size: 40px, weight: 600, lineHeight: 1.2 }
  body:        { size: 30px, weight: 400, lineHeight: 1.5 }
  eyebrow:     { size: 22px, weight: 600, letterSpacing: 2px, uppercase: true }

rounded:
  md: 8px    # botões/badges
  lg: 12px   # cards
  full: 9999px  # pílulas, indicadores de slide

spacing:
  canvas: 1080x1350px   # formato retrato Instagram (4:5)
  padding: 72px
```

## Como isso é usado no gerador

- **Capa** (`type: cover`): fundo `brand-navy`, badge roxo (`primary`) com o eyebrow, título grande branco.
- **Dica** (`type: tip`): fundo com um dos `tint-*` (rotaciona automaticamente), número em círculo roxo, título em `ink`/`charcoal`, corpo em `slate`/`charcoal`.
- **Encerramento** (`type: cta`): fundo `tint-yellow-bold`, chamada para salvar/seguir.
- Todos os slides têm indicador de progresso (pontinhos) no rodapé, no espírito das `pill-tab` do Notion.

Para trocar o estilo visual completo (ex: usar outro `DESIGN.md` do awesome-design-md), edite os valores de `TOKENS` em `scripts/generate.js`.
