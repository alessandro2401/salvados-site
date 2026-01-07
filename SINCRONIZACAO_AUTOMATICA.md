# 🔄 Sincronização Automática - Sistema de Gestão de Veículos Salvados

## 📋 Visão Geral

O sistema foi configurado para realizar **sincronização automática diária** dos dados do Google Sheets às **11h00 (horário de Brasília)**.

---

## ⚙️ Como Funciona

### 1. Vercel Cron Job (Método Principal)

O Vercel oferece suporte nativo a cron jobs que executam funções serverless em horários agendados.

#### Configuração no `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/revalidate?token=salvados-2026",
      "schedule": "0 14 * * *"
    }
  ]
}
```

**Explicação:**
- `path`: Endpoint da API que será chamado
- `schedule`: Expressão cron no formato UTC
  - `0 14 * * *` = Todos os dias às 14:00 UTC
  - **14:00 UTC = 11:00 BRT** (Brasília, UTC-3)

#### API Route: `/api/revalidate.ts`

Esta função serverless:
1. Valida o token de segurança
2. Registra log da sincronização
3. Força revalidação do cache da Vercel
4. Retorna status de sucesso/erro

**Endpoint:** `https://salvados.administradoramutual.com.br/api/revalidate`

---

## 🔐 Segurança

### Token de Autenticação

O endpoint `/api/revalidate` requer um token de segurança para evitar chamadas não autorizadas.

**Token padrão:** `salvados-2026`

#### Como usar:
- **Query string:** `?token=salvados-2026`
- **Header:** `X-Revalidate-Token: salvados-2026`

#### Alterar o token:
1. Defina a variável de ambiente `REVALIDATE_TOKEN` na Vercel
2. Use o novo token nas requisições

---

## 📅 Horário de Sincronização

### Horário Configurado:
- **Horário de Brasília (BRT):** 11:00
- **Horário UTC:** 14:00
- **Frequência:** Diária (todos os dias)

### Expressão Cron:
```
0 14 * * *
```

**Formato:** `minuto hora dia mês dia-da-semana`
- `0` = minuto 0
- `14` = hora 14 (UTC)
- `*` = todos os dias
- `*` = todos os meses
- `*` = todos os dias da semana

### Ajustar Horário:

Para alterar o horário, modifique a expressão cron no `vercel.json`:

| Horário BRT | Horário UTC | Expressão Cron |
|-------------|-------------|----------------|
| 08:00 | 11:00 | `0 11 * * *` |
| 09:00 | 12:00 | `0 12 * * *` |
| 10:00 | 13:00 | `0 13 * * *` |
| **11:00** | **14:00** | **`0 14 * * *`** ✅ |
| 12:00 | 15:00 | `0 15 * * *` |
| 13:00 | 16:00 | `0 16 * * *` |
| 14:00 | 17:00 | `0 17 * * *` |

**Nota:** Sempre considere o fuso horário UTC ao configurar cron jobs na Vercel.

---

## 🚀 Ativação do Cron Job

### Requisitos:
1. ✅ Projeto implantado na Vercel
2. ✅ Plano Pro ou superior da Vercel (cron jobs não disponíveis no plano Hobby gratuito)
3. ✅ Arquivo `vercel.json` com configuração de cron
4. ✅ API route `/api/revalidate.ts` criada

### Verificar Status:

1. Acesse o **Vercel Dashboard**
2. Navegue até o projeto `salvados-site`
3. Vá em **Settings** → **Cron Jobs**
4. Verifique se o cron está listado e ativo

### Logs de Execução:

Para ver os logs de sincronização:
1. Acesse **Vercel Dashboard** → **Deployments**
2. Clique no deployment mais recente
3. Vá em **Functions** → `/api/revalidate`
4. Veja os logs de execução

---

## 🔄 Alternativa: Cron Job Externo (Gratuito)

Se o plano da Vercel não suportar cron jobs nativos, use um serviço externo gratuito:

### Opção 1: cron-job.org (Recomendado)

1. Acesse: https://cron-job.org
2. Crie uma conta gratuita
3. Crie um novo cron job:
   - **URL:** `https://salvados.administradoramutual.com.br/api/revalidate?token=salvados-2026`
   - **Schedule:** `0 11 * * *` (11:00 BRT)
   - **Timezone:** `America/Sao_Paulo`
   - **Method:** GET
4. Salve e ative

### Opção 2: UptimeRobot

1. Acesse: https://uptimerobot.com
2. Crie uma conta gratuita
3. Adicione novo monitor:
   - **Type:** HTTP(s)
   - **URL:** `https://salvados.administradoramutual.com.br/api/revalidate?token=salvados-2026`
   - **Interval:** 1440 minutos (24 horas)
   - **Custom HTTP Headers:** `X-Revalidate-Token: salvados-2026`
4. Configure para executar às 11:00 BRT

### Opção 3: GitHub Actions (Avançado)

Crie um workflow no repositório:

```yaml
# .github/workflows/sync.yml
name: Sincronização Diária
on:
  schedule:
    - cron: '0 14 * * *'  # 11:00 BRT (14:00 UTC)
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Revalidation
        run: |
          curl -X GET "https://salvados.administradoramutual.com.br/api/revalidate?token=salvados-2026"
```

---

## 🧪 Testar Sincronização Manual

### Via Navegador:
```
https://salvados.administradoramutual.com.br/api/revalidate?token=salvados-2026
```

### Via cURL:
```bash
curl -X GET "https://salvados.administradoramutual.com.br/api/revalidate?token=salvados-2026"
```

### Via cURL com Header:
```bash
curl -X GET \
  -H "X-Revalidate-Token: salvados-2026" \
  "https://salvados.administradoramutual.com.br/api/revalidate"
```

### Resposta Esperada:
```json
{
  "success": true,
  "message": "Cache revalidado com sucesso",
  "timestamp": "07/01/2026, 11:00:00",
  "note": "Os dados serão atualizados na próxima visita ao site"
}
```

---

## 📊 Monitoramento

### Verificar Última Sincronização:

No dashboard do sistema, a última sincronização é exibida:
```
Google Sheets Conectado | Última sincronização: 07/01/2026, 11:00:00
```

### Logs de Sincronização:

Os logs são registrados no console da Vercel:
```
[SYNC] Sincronização automática iniciada em 07/01/2026, 11:00:00
```

### Alertas de Falha:

Se a sincronização falhar, o endpoint retornará:
```json
{
  "success": false,
  "error": "Erro ao revalidar cache",
  "details": "Mensagem de erro detalhada"
}
```

---

## 🔧 Troubleshooting

### Problema: Cron não está executando

**Soluções:**
1. Verifique se o plano da Vercel suporta cron jobs
2. Confirme que o `vercel.json` está correto
3. Faça redeploy do projeto após alterar `vercel.json`
4. Verifique logs na Vercel Dashboard

### Problema: Token inválido

**Soluções:**
1. Verifique se o token na URL está correto
2. Confirme a variável de ambiente `REVALIDATE_TOKEN`
3. Use o token padrão: `salvados-2026`

### Problema: Dados não atualizam

**Soluções:**
1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Verifique se o Google Sheets está acessível
3. Teste manualmente: `/api/revalidate?token=salvados-2026`
4. Verifique logs de erro na Vercel

### Problema: Horário errado

**Soluções:**
1. Confirme o fuso horário (UTC vs BRT)
2. Ajuste a expressão cron no `vercel.json`
3. BRT = UTC-3 (14:00 UTC = 11:00 BRT)
4. Redeploy após alterar

---

## 📝 Manutenção

### Alterar Horário:
1. Edite `vercel.json` → `crons[0].schedule`
2. Commit e push para GitHub
3. Vercel fará redeploy automático

### Desativar Sincronização:
1. Remova a seção `crons` do `vercel.json`
2. Commit e push para GitHub

### Alterar Frequência:

**A cada 12 horas:**
```json
"schedule": "0 14,2 * * *"
```

**A cada 6 horas:**
```json
"schedule": "0 14,20,2,8 * * *"
```

**Apenas dias úteis:**
```json
"schedule": "0 14 * * 1-5"
```

---

## 📚 Referências

- **Vercel Cron Jobs:** https://vercel.com/docs/cron-jobs
- **Cron Expression:** https://crontab.guru/
- **Timezone Converter:** https://www.worldtimebuddy.com/
- **cron-job.org:** https://cron-job.org
- **UptimeRobot:** https://uptimerobot.com

---

## ✅ Checklist de Configuração

- [x] API route `/api/revalidate.ts` criada
- [x] `vercel.json` atualizado com cron job
- [x] `@vercel/node` instalado como dependência
- [x] Token de segurança configurado
- [x] Horário ajustado para 11:00 BRT (14:00 UTC)
- [x] Documentação completa criada
- [ ] Deploy na Vercel realizado
- [ ] Cron job ativado na Vercel Dashboard
- [ ] Teste manual executado com sucesso
- [ ] Primeira sincronização automática confirmada

---

## 🎯 Próximos Passos

1. **Deploy na Vercel:**
   ```bash
   git add .
   git commit -m "feat: adicionar sincronização automática diária às 11h"
   git push origin main
   ```

2. **Verificar Cron Job:**
   - Acesse Vercel Dashboard
   - Vá em Settings → Cron Jobs
   - Confirme que o cron está ativo

3. **Testar Manualmente:**
   ```bash
   curl "https://salvados.administradoramutual.com.br/api/revalidate?token=salvados-2026"
   ```

4. **Aguardar Primeira Execução:**
   - Próxima execução: Amanhã às 11:00 BRT
   - Verificar logs na Vercel Dashboard

---

**Status:** ✅ Configuração completa e pronta para deploy!
