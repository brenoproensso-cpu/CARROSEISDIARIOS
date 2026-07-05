# DESIGN.md — Editorial elegante

> Estilo próprio do gerador em `scripts/generate.js`, inspirado em layouts de revista/editorial (não é um dos arquivos originais do [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md), mas segue a mesma ideia de documentar tokens de design em markdown).
> Mudar um valor aqui não altera o gerador automaticamente — os tokens estão duplicados como CSS em `scripts/generate.js` para manter a geração de imagem sem dependências externas.

```yaml
colors:
  cream: "#f7f4ee"      # fundo das páginas internas (slides de dica)
  ink: "#1c1a17"        # fundo da capa/contracapa; texto principal sobre creme
  ink-soft: "#3a352c"   # corpo de texto sobre creme
  accent: "#a6462c"     # terracota — kicker, numeral em marca d'água, marca do rodapé
  cream-muted: "rgba(247,244,238,0.7)"  # texto secundário sobre fundo escuro
  rule: "#d8d2c4"        # linhas finas sobre creme
  rule-on-dark: "rgba(247,244,238,0.25)"  # linhas finas sobre tinta

typography:
  serif: "Georgia, 'Iowan Old Style', 'Times New Roman', ui-serif, serif"   # títulos e corpo
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif"                    # kickers/rodapé (versalete)
  title-cover: { size: 76px, weight: 700 }
  title-tip:   { size: 46px, weight: 700 }
  title-cta:   { size: 52px, weight: 700 }
  body:        { size: 32px, weight: 400, lineHeight: 1.6 }
  kicker:      { size: 20px, weight: 700, letterSpacing: 4px, uppercase: true }

layout:
  canvas: 1080x1350px   # formato retrato Instagram (4:5)
  padding: 80px
  frame: "moldura fina (1px) a 36px da borda, em todos os slides"
```

## Estrutura de cada tipo de slide

- **Capa** (`type: cover`): fundo `ink` (efeito "capa de revista"), kicker em `accent`, título serifado grande em creme, subtítulo itálico.
- **Dica** (`type: tip`): fundo `cream`, número gigante em marca d'água (`accent`, opacidade baixa) no canto superior direito, kicker "DICA Nº XX", título serifado, corpo serifado em `ink-soft`.
- **Encerramento** (`type: cta`): fundo `ink` novamente (bookend com a capa), kicker com o `@handle`, título e corpo serifados em creme.
- Rodapé em todos os slides: paginação estilo revista (`01 — 07`) à esquerda + marquinha quadrada `accent` à direita, com uma linha fina acima.

Para trocar o estilo visual completo, edite o objeto `TOKENS` em `scripts/generate.js` (cores, fontes, tamanhos).
