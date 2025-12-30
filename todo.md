# Sistema Salvados - TODO

## Sprint 1: Setup e Estrutura

- [x] Estruturar schema do banco de dados (veículos, leilões, cache FIPE)
- [ ] Configurar variáveis de ambiente (FIPE_API_TOKEN, GOOGLE_SERVICE_ACCOUNT_KEY, percentuais)
- [x] Implementar autenticação SSO com controle de roles (admin/user)

## Sprint 2: Importação e Cálculo (MVP)

- [x] Implementar parsing de planilhas Excel (.xlsx)
- [x] Criar integração com Fipe API (fipe.parallelum.com.br/api/v2)
- [x] Implementar sistema de cache FIPE no PostgreSQL
- [x] Desenvolver lógica de cálculo do Valor Esperado de Retorno (25% Sucata, 40% Recuperável)
- [x] Criar módulo de importação de planilhas de leilão

## Sprint 3: Aprovação e Automação

- [x] Desenvolver interface de Análise de Aprovação com KPIs
- [x] Implementar aprovação/rejeição individual de veículos
- [x] Criar dashboard com tabela de veículos e código de cores para desvio
- [ ] Integrar Google Sheets API para extração de múltiplas abas
- [ ] Implementar sistema de Webhook via Google Apps Script

## Sprint 4: Finalização e Deploy

- [ ] Criar módulo de cadastro manual de novos veículos
- [ ] Implementar relatórios de performance de leilão
- [ ] Adicionar testes de segurança e funcionais
- [ ] Criar documentação técnica (Docs as Code)


## Novas Funcionalidades (Fase 2)

- [x] Criar página de cadastro manual de veículos
- [x] Implementar formulário com validação de campos
- [x] Adicionar busca automática de valor FIPE ao preencher marca/modelo/ano
- [x] Criar helper para integração com Google Sheets API
- [x] Implementar extração de dados de múltiplas abas do Google Sheets
- [x] Criar endpoint webhook para receber notificações do Google Apps Script
- [x] Documentar configuração do Google Apps Script
- [x] Criar página de relatórios de performance
- [x] Implementar gráficos de análise de desvio por tipo de veículo
- [x] Adicionar histórico de leilões com filtros
- [ ] Implementar exportação de relatórios em PDF/Excel (placeholder criado)


## Novas Funcionalidades (Fase 3)

- [x] Implementar exportação de relatórios em PDF (jsPDF)
- [x] Implementar exportação de relatórios em Excel (xlsx)
- [x] Criar sistema de notificações para administradores
- [x] Implementar notificações para vendas abaixo do esperado
- [x] Implementar notificações para novos veículos no pátio
- [x] Configurar variáveis de ambiente no Vercel (documentação criada)
- [x] Documentar configuração de credenciais do Google Sheets
- [x] Criar guia de configuração de variáveis de ambiente
