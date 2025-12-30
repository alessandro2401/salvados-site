# Configuração da Sincronização Automática Diária

## Objetivo

Sincronizar os dados da planilha Google Sheets e atualizar a página de lista de processos automaticamente **uma vez por dia** (08:00 UTC / 05:00 Brasília).

## Como Configurar

### Opção 1: Criar o Workflow via GitHub Web (Recomendado)

1. **Acesse o repositório no GitHub:**
   - https://github.com/alessandro2401/gestaosegura-site

2. **Crie a pasta de workflows:**
   - Clique em "Add file" → "Create new file"
   - Digite o caminho: `.github/workflows/sync-daily.yml`

3. **Cole o conteúdo abaixo:**

```yaml
name: Sincronização Diária de Dados

on:
  schedule:
    # Executa todos os dias às 08:00 UTC (05:00 Brasília)
    - cron: '0 8 * * *'
  workflow_dispatch:  # Permite execução manual

jobs:
  sync:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout do repositório
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Configurar Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Sincronizar dados do Google Sheets
        run: |
          cd ${{ github.workspace }}
          python3 scripts/sync_sheets_data.py
      
      - name: Gerar tabela HTML
        run: |
          cd ${{ github.workspace }}
          python3 scripts/generate_processos_table.py
      
      - name: Verificar mudanças
        id: verify
        run: |
          if git diff --quiet; then
            echo "has_changes=false" >> $GITHUB_OUTPUT
          else
            echo "has_changes=true" >> $GITHUB_OUTPUT
          fi
      
      - name: Configurar Git
        if: steps.verify.outputs.has_changes == 'true'
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
      
      - name: Commit e Push das mudanças
        if: steps.verify.outputs.has_changes == 'true'
        run: |
          git add data/processos.json processos-lista.html
          git commit -m "chore: Sincronização automática diária de dados - $(date +'%d/%m/%Y %H:%M:%S')"
          git push
      
      - name: Notificar sucesso
        if: success()
        run: |
          echo "✅ Sincronização concluída com sucesso!"
          echo "📊 Dados atualizados em: $(date +'%d/%m/%Y %H:%M:%S')"
      
      - name: Notificar erro
        if: failure()
        run: |
          echo "❌ Erro na sincronização!"
          exit 1
```

4. **Commit o arquivo:**
   - Clique em "Commit new file"
   - Mensagem: "chore: Adicionar workflow de sincronização automática diária"

### Opção 2: Executar Manualmente (Para Testes)

Se você quiser testar a sincronização antes de configurar o agendamento automático:

1. **Acesse GitHub Actions:**
   - https://github.com/alessandro2401/gestaosegura-site/actions

2. **Clique em "Sincronização Diária de Dados"**

3. **Clique em "Run workflow"**

4. **Selecione a branch "master"**

5. **Clique em "Run workflow"**

## O que Acontece Automaticamente

### Todos os dias às 08:00 UTC (05:00 Brasília):

1. ✅ **Sincroniza dados** do Google Sheets
   - Lê a aba "Controle de Prazos GS"
   - Extrai os 51 processos únicos
   - Salva em `data/processos.json`

2. ✅ **Gera tabela HTML**
   - Lê o arquivo JSON
   - Cria a página `processos-lista.html`
   - Aplica formatação e cores

3. ✅ **Faz commit e push**
   - Envia as mudanças para o GitHub
   - Vercel faz o redeploy automaticamente

4. ✅ **Site é atualizado**
   - A página em `processos-lista.html` reflete os dados mais recentes

## Verificar se está Funcionando

### 1. Monitorar Execuções:
- Acesse: https://github.com/alessandro2401/gestaosegura-site/actions
- Você verá o histórico de execuções do workflow

### 2. Verificar Logs:
- Clique na execução mais recente
- Veja os logs de cada step
- Procure por "✅ Sincronização concluída com sucesso!"

### 3. Testar Manualmente:
```bash
cd /home/ubuntu/gestaosegura-site
python3 scripts/sync_sheets_data.py
python3 scripts/generate_processos_table.py
```

## Estrutura de Arquivos

```
gestaosegura-site/
├── .github/
│   └── workflows/
│       └── sync-daily.yml          ← Workflow de sincronização
├── scripts/
│   ├── sync_sheets_data.py         ← Sincroniza Google Sheets
│   └── generate_processos_table.py ← Gera HTML da tabela
├── data/
│   └── processos.json              ← Dados sincronizados
├── processos-lista.html            ← Página com a tabela
└── index.html                      ← Página principal (com links)
```

## Solução de Problemas

### Problema: Workflow não executa

**Solução:**
1. Verifique se o arquivo está em `.github/workflows/sync-daily.yml`
2. Verifique a sintaxe YAML (sem tabs, apenas espaços)
3. Acesse "Actions" → "Workflows" → Habilite o workflow

### Problema: Erro "refusing to allow a GitHub App to create or update workflow"

**Solução:**
- Use um token com permissões adequadas
- Ou crie o arquivo diretamente via GitHub Web UI

### Problema: Dados não são atualizados

**Solução:**
1. Verifique se o Google Sheets está acessível
2. Verifique se a URL do Sheets está correta
3. Teste manualmente: `python3 scripts/sync_sheets_data.py`

## Customizações

### Mudar a hora de sincronização:

No arquivo `.github/workflows/sync-daily.yml`, altere a linha:
```yaml
- cron: '0 8 * * *'  # 08:00 UTC (05:00 Brasília)
```

**Exemplos:**
- `'0 12 * * *'` → 12:00 UTC (09:00 Brasília)
- `'0 0 * * *'` → 00:00 UTC (21:00 Brasília anterior)
- `'0 */6 * * *'` → A cada 6 horas

### Adicionar notificações:

Você pode adicionar steps para enviar notificações por email, Slack, etc.

## Contato e Suporte

Para dúvidas ou problemas:
1. Verifique os logs do GitHub Actions
2. Teste manualmente os scripts
3. Verifique a documentação do Google Sheets API

---

**Última atualização:** 15/12/2025
**Status:** ✅ Pronto para usar
