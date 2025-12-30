# Relatório Executivo e Plano de Ação Completo: Sistema Salvados

## 1. Introdução e Objetivo do Projeto

O sistema **Salvados** será uma aplicação web crítica para a gestão e controle financeiro dos veículos indenizados pelo Movimento Mais Brasil (MMB), provenientes de perda total.

**Objetivo Principal:** Centralizar a gestão de veículos salvados, substituir a dependência de planilhas externas (Google Sheets) e fornecer uma interface de aprovação de vendas baseada em regras de negócio (percentual FIPE), garantindo o retorno financeiro esperado para o caixa do MMB.

**Endereço de Implantação:** `https://salvados.administradoramutual.com.br/` (Subdomínio do sistema principal).

## 2. Arquitetura e Requisitos Técnicos

A arquitetura foi definida para garantir alta performance, escalabilidade e segurança, seguindo o padrão de desenvolvimento da Administradora Mutual.

### 2.1. Stack Tecnológica

| Componente | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Frontend/Backend** | **Next.js 14 (App Router) + TypeScript** | Padrão da empresa (consistência com S4), SSR/SSG para performance, segurança e SEO. |
| **Hospedagem** | **Vercel** | Padrão da empresa, CI/CD automatizado, escalabilidade *serverless*. |
| **Banco de Dados** | **PostgreSQL (Serverless)** | Robustez, integridade de dados, suporte a JSON e escalabilidade via provedores como Neon ou Supabase. |
| **Estilização** | **Tailwind CSS** | Desenvolvimento rápido e consistente com o design system. |

### 2.2. Requisitos de Infraestrutura (Vercel e DNS)

| Requisito | Detalhe |
| :--- | :--- |
| **Configuração DNS** | Criar um registro **CNAME** apontando `salvados.administradoramutual.com.br` para o domínio Vercel do projeto. |
| **Banco de Dados** | Provisionar uma instância de PostgreSQL com conexão *serverless* (pool de conexões) e configurar a URL de conexão como a variável de ambiente `DATABASE_URL` no Vercel. |
| **Variáveis de Ambiente** | Armazenar de forma segura no Vercel: `DATABASE_URL`, `NEXTAUTH_SECRET`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `FIPE_API_TOKEN`, e os percentuais de cálculo FIPE (`FIPE_SUCATA_PERCENTUAL`, `FIPE_RECUPERAVEL_PERCENTUAL`). |

## 3. Funcionalidades Chave e Integrações

O sistema será construído em torno de três funcionalidades principais, com integrações críticas para automação de dados.

### 3.1. Módulo de Importação e Aprovação (Core)

*   **Importação de Planilha:** O sistema deve permitir o *upload* da planilha de leilão (`MAISBRASIL-10.12.25-Autorizada.xlsx`) para alimentar o banco de dados.
*   **Cálculo Automático:** O sistema calculará o **Valor Esperado de Retorno** para cada veículo (25% FIPE para Sucata, 40% FIPE para Recuperável).
*   **Interface de Aprovação:** A página de **Análise de Aprovação** (Layout Visualizado [1]) exibirá KPIs de performance e permitirá a aprovação ou rejeição individual de cada veículo.
*   **Cadastro de Veículos:** Colaboradores poderão incluir novos veículos e atualizar o status.

### 3.2. Integração com Tabela FIPE (Fonte de Dados)

A API utilizada será a **Fipe API (fipe.online)**, a mesma já em uso no projeto S4, garantindo consistência [2].

| Ação | Estratégia de Mitigação de Risco |
| :--- | :--- |
| **Obtenção FIPE** | Reutilizar a API `https://fipe.parallelum.com.br/api/v2`. |
| **Risco de Limite** | Implementar uma estratégia de **Caching Robusta no PostgreSQL**. O sistema deve armazenar os valores FIPE consultados localmente, minimizando as requisições à API externa (limite de 1.000/dia) [3]. |

### 3.3. Integração com Google Sheets (Automação)

| Ação | Estratégia de Implementação |
| :--- | :--- |
| **Extração de Dados** | Utilizar a **Google Sheets API** para ler todas as abas da planilha, garantindo a extração de dados de forma estruturada e segura. |
| **Atualização Automática** | Implementar **Google Apps Script + Webhook**. O GAS monitorará a planilha e enviará um Webhook para o sistema Salvados, acionando a re-importação dos dados em caso de alteração. |

## 4. Plano de Ação Completo (Roadmap)

O desenvolvimento será dividido em 4 Sprints, com duração total estimada de **10 Semanas**.

| Sprint | Duração | Foco Principal | Entregáveis Chave |
| :--- | :--- | :--- | :--- |
| **Sprint 1: Setup e Estrutura** | 2 Semanas | Configuração da Infraestrutura e Estrutura Base do Projeto. | Projeto Next.js configurado no Vercel, Conexão PostgreSQL, Autenticação de Usuário (SSO), Estrutura de Banco de Dados (Tabelas Veículo, Usuário). |
| **Sprint 2: Importação e Cálculo (MVP)** | 3 Semanas | Funcionalidade de Importação de Dados e Cálculo FIPE. | **Módulo de Importação de Planilha (Fase A)**, **Lógica de Caching FIPE no PostgreSQL**, Cálculo do Valor Esperado de Retorno, Listagem de Veículos. |
| **Sprint 3: Aprovação e Automação** | 3 Semanas | Interface de Decisão e Automação de Dados. | **Página de Análise de Aprovação (Layout Final)**, Lógica de Aprovação/Rejeição Individual, **Integração Webhook (Fase B)** via Google Apps Script. |
| **Sprint 4: Finalização e Deploy** | 2 Semanas | Módulos de Colaboradores, Testes e Documentação. | Módulo de Cadastro de Novos Veículos, Relatórios de Performance, Testes de Segurança e Funcionais, Documentação Técnica (Docs as Code). |

---
### Referências

[1] Modelo Visual da Página de Aprovação: `layout_aprovacao_salvados.png`.
[2] Relatório de Análise e Recomendação da API FIPE: `relatorio_fipe_s4_reutilizacao.md`.
[3] Resumo Técnico da Fipe API: `resumo_tecnico_fipe_api.md`.
[4] Relatório de Viabilidade e Plano de Ação para Integração Automática: `relatorio_integracao_google_sheets.md`.
[5] Plano de Ação Completo (Original): `plano_de_acao_salvados_final.md`.
