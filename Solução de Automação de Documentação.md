# Solução de Automação de Documentação

Esta solução implementa a automação da documentação do conteúdo do site principal (`administradoramutual.com.br`) no Portal de Documentação (`docs.administradoramutual.com.br`).

## 1. Componentes da Solução

### A. Script de Extração (`extract_content.py`)

*   **Função:** Acessa as URLs do site principal (Home, Legislação, Seguradoras, Mutualismo) via `requests`.
*   **Processamento:** Utiliza `BeautifulSoup` para analisar o HTML e `markdownify` para converter o conteúdo principal de cada página para o formato Markdown.
*   **Saída:** Gera um arquivo Markdown (`temp_institucional_doc.md`) com o conteúdo extraído.

### B. GitHub Action (`.github/workflows/document_site.yml`)

Este workflow é o coração da automação. Ele é executado a cada *push* na *branch* `main` do repositório do site (`alessandro2401/administradora-mutual-site`).

**Passos Principais:**
1.  **Checkout:** Clona o repositório do site.
2.  **Instalação:** Instala as dependências Python (`requests`, `beautifulsoup4`, `markdownify`).
3.  **Execução do Script:** Roda o `extract_content.py` para gerar o arquivo Markdown.
4.  **Checkout do Docs:** Clona o repositório de documentação (`alessandro2401/docs-administradora`).
5.  **Cópia:** Copia o arquivo Markdown gerado para a pasta correta no repositório do Docs (`docs-repo/docs/sites-publicos/institucional-auto.md`).
6.  **Commit e Push:** Faz um *commit* automático no repositório do Docs com a atualização e envia para o GitHub.

## 2. Requisitos de Configuração

Para que a automação funcione, é **fundamental** que o repositório do site (`alessandro2401/administradora-mutual-site`) tenha um *Secret* configurado no GitHub chamado `DOCS_REPO_TOKEN`.

*   **Nome do Secret:** `DOCS_REPO_TOKEN`
*   **Valor:** Um **Personal Access Token (PAT)** do GitHub com permissão de **escrita** (`repo` scope) no repositório `alessandro2401/docs-administradora`.

## 3. Próximos Passos

1.  **Configurar o Secret:** O usuário deve configurar o `DOCS_REPO_TOKEN` no GitHub.
2.  **Commit dos Arquivos:** O usuário deve fazer o *commit* e *push* do `extract_content.py` e do `README_AUTOMACAO.md` para o repositório do site.
3.  **Criação do Workflow:** O usuário deve criar o arquivo `.github/workflows/document_site.yml` manualmente no GitHub, pois o push direto falhou devido a restrições de segurança. O conteúdo do arquivo está na seção 4.
4.  **Atualizar o Docs:** O usuário deve atualizar o arquivo `docs/sites-publicos/institucional.md` no repositório do Docs para incluir o novo arquivo gerado (`institucional-auto.md`).

**Observação:** O arquivo gerado automaticamente é salvo como `institucional-auto.md` para evitar sobrescrever o arquivo manual `institucional.md`. O arquivo `institucional.md` deve ser atualizado para incluir o conteúdo do arquivo automático.

## 4. Conteúdo do Arquivo de Workflow (`.github/workflows/document_site.yml`)

```yaml
name: Auto-Document Site Content

on:
  push:
    branches:
      - main # Executa sempre que houver um push para a branch principal

jobs:
  document_and_update_docs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Site Repository
        uses: actions/checkout@v4
        with:
          repository: alessandro2401/administradora-mutual-site # Repositório do site
          token: ${{ secrets.GITHUB_TOKEN }} # Token padrão do GitHub Actions

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.x'

      - name: Install Dependencies
        run: |
          pip install requests beautifulsoup4 markdownify

      - name: Run Content Extraction Script
        run: python extract_content.py

      - name: Commit and Push to Docs Repository
        uses: actions/checkout@v4
        with:
          repository: alessandro2401/docs-administradora # Repositório de documentação
          path: docs-repo
          token: ${{ secrets.DOCS_REPO_TOKEN }} # Token com permissão de escrita no repositório do Docs

      - name: Copy Generated Documentation
        run: |
          cp temp_institucional_doc.md docs-repo/docs/sites-publicos/institucional-auto.md

      - name: Commit and Push Changes
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          repository: docs-repo
          commit_message: 'docs(auto): Atualização automática do conteúdo do Site Institucional'
          branch: main
          file_pattern: docs/sites-publicos/institucional-auto.md
          commit_user_name: Manus AI Documentation Bot
          commit_user_email: manus-ai-bot@administradoramutual.com.br
          commit_author: Manus AI Documentation Bot <manus-ai-bot@administradoramutual.com.br>
```
