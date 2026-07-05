# CARROSEISDIARIOS

Criação de carrosséis e posts para Instagram, gerados automaticamente em PNG a partir de um arquivo de conteúdo, com visual jurídico (preto/branco/laranja) — ver `DESIGN.md`.

## Como usar

1. Instale as dependências:
   ```
   npm install
   ```

2. Crie (ou edite) um arquivo de conteúdo em `content/`, seguindo o formato de `content/direito-acidente.json`. O conteúdo é uma lista de `blocks` — ver os tipos disponíveis (`hero`, `grid`, `banner`, `note`, `footer`) em `DESIGN.md`.

3. Gere as imagens:

   **Post único** (uma imagem só, altura automática — igual a um post/story de feed):
   ```
   npm run generate:post -- content/direito-acidente.json
   ```
   Sai em `output/direito-acidente.png`.

   **Carrossel** (um slide 1080x1350 por bloco, com paginação no canto):
   ```
   npm run generate -- content/direito-acidente.json
   ```
   Sai em `output/direito-acidente/slide-01.png`, `slide-02.png`, etc.

## Estilo visual

O visual (cores, tipografia, ícones, componentes) segue os tokens em `DESIGN.md`. Para mudar cores/fontes, edite `TOKENS` em `scripts/juridico.js`; para adicionar um bloco ou ícone novo, veja a seção correspondente em `DESIGN.md`.
