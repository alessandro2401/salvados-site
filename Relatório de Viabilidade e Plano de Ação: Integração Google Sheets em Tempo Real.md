# Relatório de Viabilidade e Plano de Ação: Integração Google Sheets em Tempo Real

## 1. Viabilidade Técnica

A extração de todos os dados da planilha do Google Sheets (`https://docs.google.com/spreadsheets/d/1M6cez9KsP0KdvkYrcwITd4eMkA10KpYUmPxIvNGCmEI/edit?usp=sharing`) para alimentar o sistema Salvados é **totalmente viável** e será realizada através da **Google Sheets API**.

A criação de um mecanismo de **atualização automática em tempo real** é viável, mas requer a utilização de uma ferramenta intermediária: o **Google Apps Script (GAS)**.

## 2. Estratégia de Integração

A integração será dividida em duas fases, conforme o Plano de Ação do sistema Salvados:

### Fase A: Extração Inicial e Alimentação (Sprint 2)

Esta fase garante a funcionalidade de importação de dados para o sistema.

| Objetivo | Ferramenta | Ações Necessárias |
| :--- | :--- | :--- |
| **Extração de Dados** | **Google Sheets API** | Utilizar a API para ler sequencialmente os dados de todas as abas relevantes (`Venda Autorizada`, `Vendido e Não Recebido`, etc.) [1]. |
| **Segurança** | **Google Cloud Platform** | Criar uma Conta de Serviço (Service Account) e armazenar a chave de acesso como `GOOGLE_SERVICE_ACCOUNT_KEY` no Vercel. |
| **Desenvolvimento** | **Next.js Server Actions** | Criar a função de *backend* que recebe o ID da planilha, autentica com a API e mapeia os dados para o modelo do PostgreSQL. |

### Fase B: Atualização Automática em Tempo Real (Sprint 3)

Esta fase garante que o sistema Salvados seja notificado imediatamente sobre qualquer alteração na planilha.

| Objetivo | Ferramenta | Ações Necessárias |
| :--- | :--- | :--- |
| **Gatilho de Alteração** | **Google Apps Script (GAS)** | Criar um script no GAS com um gatilho `onEdit` ou `onChange` para monitorar a planilha [2]. |
| **Notificação** | **Webhook (GAS)** | O script do GAS deve enviar uma requisição `POST` para um *endpoint* seguro do Salvados (ex: `/api/webhook/sheets-update`) quando uma alteração for detectada. |
| **Processamento** | **Next.js API Route** | O *endpoint* do Salvados deve receber o Webhook e acionar a função de extração da Fase A para reprocessar a planilha ou a aba alterada. |

## 3. Recomendações e Riscos

| Item | Recomendação | Risco Mitigado |
| :--- | :--- | :--- |
| **Prioridade** | Priorizar a **Fase A (Importação)** no Sprint 2 para estabilizar a funcionalidade principal. | Atraso na entrega da funcionalidade de base. |
| **Segurança** | O *endpoint* de Webhook deve ser protegido com um *secret token* para evitar requisições maliciosas. | Injeção de dados ou ataques de negação de serviço. |
| **Manutenção** | O Google Apps Script é um ponto de falha adicional. Deve ser bem documentado e monitorado. | Falha na sincronização de dados devido a problemas no script externo. |

## 4. Conclusão

A integração com o Google Sheets API é a solução padrão para a extração de dados. A funcionalidade de atualização automática, embora exija o uso do Google Apps Script, é a maneira mais eficaz de atingir o objetivo de sincronização em tempo real.

---
### Referências

[1] Google Sheets API Documentation.
[2] Google Apps Script Triggers Documentation.
[3] Análise de Viabilidade: Integração Google Sheets em Tempo Real: `google_sheets_integracao_analise.md`.
