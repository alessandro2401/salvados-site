# Análise de Viabilidade: Integração Google Sheets em Tempo Real

## 1. Viabilidade de Extração de Dados (Google Sheets API)

*   **Viabilidade:** **Alta.**
*   **Ferramenta:** Google Sheets API.
*   **Como Funciona:** A API permite a leitura de dados de planilhas e de **múltiplas abas** (worksheets) em uma única chamada ou em chamadas sequenciais.
*   **Integração com Next.js:** É uma prática comum utilizar a Google Sheets API em aplicações Next.js, mantendo as credenciais seguras no *backend* (Server Actions ou API Routes) [1] [2].
*   **Autenticação:** Requer a criação de uma conta de serviço no Google Cloud Platform para obter as credenciais (Service Account Key) e compartilhamento da planilha com o e-mail dessa conta.

## 2. Viabilidade de Atualização Automática (Webhooks)

*   **Viabilidade:** **Média-Alta**, mas requer o uso de uma ferramenta intermediária.
*   **Ferramenta:** Google Apps Script (GAS) e Webhooks.
*   **Como Funciona:** A Google Sheets API **não oferece um recurso nativo de Webhook** que notifique o sistema Salvados sobre alterações. A solução mais robusta é:
    1.  Criar um script no **Google Apps Script** (GAS) associado à planilha.
    2.  Configurar um **Gatilho (`onEdit` ou `onChange`)** no GAS para monitorar alterações.
    3.  Quando uma alteração é detectada, o script GAS executa uma função que envia um **Webhook (requisição HTTP POST)** para um *endpoint* específico do sistema Salvados (ex: `/api/webhook/sheets-update`).
*   **Desvantagem:** O GAS tem limitações de tempo de execução e é um ponto de falha adicional. A configuração inicial é mais complexa.

## 3. Plano de Ação para Integração

A integração deve ser dividida em duas fases: a extração inicial e a atualização automática.

### Fase A: Extração Inicial e Alimentação do Sistema (Sprint 2)

1.  **Configuração do Google Cloud:** Criar um projeto no GCP, habilitar a Google Sheets API e gerar a chave da Conta de Serviço (`Service Account Key`).
2.  **Configuração de Credenciais:** Armazenar a chave da Conta de Serviço como uma Variável de Ambiente (`GOOGLE_SERVICE_ACCOUNT_KEY`) no Vercel.
3.  **Desenvolvimento do Módulo de Importação:** Criar uma função no *backend* do Salvados que:
    *   Recebe o ID da planilha.
    *   Utiliza a Google Sheets API para ler sequencialmente os dados de todas as abas relevantes (`Venda Autorizada`, `Vendido e Não Recebido`, etc.).
    *   Mapeia os dados para o modelo do PostgreSQL e armazena.

### Fase B: Atualização Automática em Tempo Real (Sprint 3)

1.  **Criação do Endpoint Webhook:** Criar um *endpoint* seguro no Salvados (`/api/webhook/sheets-update`) para receber a notificação do GAS.
2.  **Desenvolvimento do Google Apps Script:**
    *   Criar um script no GAS que monitora as alterações na planilha.
    *   O script deve enviar uma requisição POST para o *endpoint* do Salvados, informando que a planilha foi alterada.
3.  **Lógica de Processamento do Webhook:** O *endpoint* do Salvados deve, ao receber o Webhook, acionar a função de importação da Fase A para reprocessar a planilha ou apenas a aba alterada.

## 4. Conclusão

A extração de todos os dados é **totalmente viável** via Google Sheets API. A atualização automática é viável através do **Google Apps Script + Webhooks**, mas requer um esforço de desenvolvimento maior e a manutenção de um script externo.

A recomendação é priorizar a **Fase A (Importação Manual/Agendada)** no Sprint 2 e planejar a **Fase B (Atualização Automática)** para o Sprint 3, após a estabilização do sistema.

---
### Referências

[1] Using Google Sheets as another database in your Next.js app: `https://levelup.gitconnected.com/using-google-sheets-as-another-database-in-your-next-js-app-ab1b2c6d8f1a`.
[2] Using Server Actions + Google Sheets API as a simple...: `https://www.reddit.com/r/nextjs/comments/1jw3xnn/using_server_actions_google_sheets_api_as_a/`.
[3] Trigger webhook when Google Sheet edited (Stack Overflow): `https://stackoverflow.com/questions/47690332/trigger-webhook-when-google-sheet-edited`.
