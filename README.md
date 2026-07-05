# CARROSEISDIARIOS

Criação de carrosséis e posts para Instagram, gerados automaticamente em PNG a partir de um arquivo de conteúdo, com visual baseado no design system do Notion (ver `DESIGN.md`).

## Como usar

1. Instale as dependências:
   ```
   npm install
   ```

2. Crie (ou edite) um arquivo de conteúdo em `content/`, seguindo o formato de `content/dicas-produtividade.json`:
   ```json
   {
     "handle": "@seuperfil",
     "slides": [
       { "type": "cover", "eyebrow": "5 dicas", "title": "Seu título", "subtitle": "Arrasta pro lado →" },
       { "type": "tip", "number": 1, "title": "Título da dica", "body": "Texto da dica." },
       { "type": "cta", "title": "Gostou?", "body": "Salva e segue pra mais." }
     ]
   }
   ```
   Tipos de slide disponíveis: `cover` (capa), `tip` (dica numerada) e `cta` (encerramento).

3. Gere as imagens:
   ```
   npm run generate -- content/dicas-produtividade.json
   ```

4. As imagens (1080x1350, formato retrato do Instagram) saem em `output/dicas-produtividade/slide-01.png`, `slide-02.png`, etc. — prontas para subir no carrossel.

## Estilo visual

O visual (cores, tipografia, espaçamento) segue os tokens em `DESIGN.md`, adaptados do design system do Notion. Para mudar o estilo (cores, fontes, etc.), edite o objeto `TOKENS` em `scripts/generate.js`.
