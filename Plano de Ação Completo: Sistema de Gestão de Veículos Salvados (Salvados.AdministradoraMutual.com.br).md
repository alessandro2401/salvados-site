# Plano de Ação Completo: Sistema de Gestão de Veículos Salvados (Salvados.AdministradoraMutual.com.br)

## 1. Contexto e Objetivo

O objetivo é criar o sistema **Salvados** (`https://salvados.administradoramutual.com.br/`) para centralizar a gestão de veículos indenizados, substituindo o fluxo manual via Google Sheets. O sistema será integrado ao subdomínio `https://sistemas.administradoramutual.com.br/` e deve atender às seguintes necessidades:

*   **Substituição da Planilha:** Eliminar a dependência do Google Sheets para a gestão do fluxo de veículos.
*   **Importação de Leilão:** Permitir o upload de planilhas de leilão para análise automática.
*   **Análise de Conformidade:** Aplicar as regras de cálculo (25% Sucata / 40% Recuperável) e calcular o desvio em relação ao valor vendido.
*   **Aprovação Individualizada:** Permitir a aprovação ou rejeição da venda de cada veículo (placa) individualmente.
*   **Gestão Completa:** Permitir que colaboradores incluam novos veículos e gerenciem o status de todo o fluxo.

## 2. Arquitetura Técnica Proposta (Fase 1)

A arquitetura foi desenhada para garantir **performance, escalabilidade e alinhamento** com a infraestrutura existente da Administradora Mutual.

| Componente | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Framework Full-stack** | **Next.js 14** (App Router) com **TypeScript** | Alinhamento com o ecossistema Vercel e o site `s4`. Oferece roteamento avançado, renderização híbrida e segurança de tipos. |
| **Estilização** | **Tailwind CSS** | Desenvolvimento rápido e consistente, garantindo um design responsivo e moderno. |
| **Banco de Dados** | **PostgreSQL** | Robustez, escalabilidade e suporte nativo a JSONB (ideal para dados flexíveis de planilhas). |
| **ORM/Acesso a Dados** | **Drizzle ORM** | ORM moderno, *type-safe* e leve, para consultas SQL seguras e tipadas. |
| **Hospedagem/CI/CD** | **Vercel** | Integração contínua e *deploy* automatizado, aproveitando a infraestrutura já utilizada. |
| **Autenticação** | **Integração com `sistemas.administradoramutual.com.br`** | Utilizar o sistema de autenticação existente para garantir *Single Sign-On* (SSO). |

## 3. Escopo Funcional (Fase 2)

O sistema será dividido em três módulos principais, com as seguintes telas e funcionalidades:

### A. Módulo de Importação e Aprovação (Fluxo de Leilão)

| Tela | Funcionalidades Chave |
| :--- | :--- |
| **Upload de Planilha** | **Upload:** Permite o upload de arquivos `.xlsx` de leilão. **Processamento:** Aplica as regras de cálculo (25%/40% FIPE) e calcula o **Desvio** (Valor Alcançado - Valor Sugerido). |
| **Análise de Aprovação** | **Visualização Consolidada:** Lista os veículos importados, destacando o Desvio. **Aprovação Individual:** Botão de **Aprovar Venda** ou **Rejeitar Venda** por placa. **Aprovação em Lote:** Opção para aprovar todos os veículos que atingiram ou superaram o Valor Sugerido. |

### B. Módulo de Cadastro e Gestão (Fluxo Operacional)

| Tela | Funcionalidades Chave |
| :--- | :--- |
| **Cadastro de Veículo** | **Inclusão Manual:** Formulário para colaboradores incluírem novos veículos (Placa, Marca, Modelo, FIPE, Situação: Sucata/Recuperável). |
| **Gestão de Status** | **Filtros por Status:** Filtra a lista de veículos pelas situações da planilha (Novos No Pátio, Venda Autorizada, Vendido e Não Recebido, etc.). **Ação de Regularização:** Botão para marcar "Vendido e Não Recebido" como "Recebido" ou "Venda Cancelada". **Ação de Liberação:** Botão para marcar "Proibida a Venda" como "Venda Autorizada". |

### C. Módulo de Relatórios e Dashboards (Visão Estratégica)

| Tela | Funcionalidades Chave |
| :--- | :--- |
| **Dashboard Principal** | **Métricas Chave (KPIs):** Exibe Valor Total FIPE, Valor Total Sugerido, Valor Total Vendido e o Desvio Total (R$ e %). **Gráfico de Fluxo:** Visualização do funil de veículos por status. |
| **Relatório de Auditoria** | **Histórico de Aprovações:** Rastreia quem aprovou/rejeitou cada venda e a justificativa. **Histórico de Importação:** Rastreia todas as planilhas de leilão importadas. |

## 4. Plano de Ação Detalhado (Roadmap - Fase 3)

O desenvolvimento será dividido em 4 Sprints, com uma duração total estimada de **10 Semanas**.

| Sprint | Foco Principal | Entregáveis Chave | Duração Estimada |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | **Infraestrutura e Dados** | Configuração do Next.js, PostgreSQL, Drizzle ORM. Implementação do modelo de dados (`Veiculo` e `ImportacaoLeilao`). | 2 Semanas |
| **Sprint 2** | **Módulo de Importação e Aprovação (MVP)** | Tela de Upload de Planilha. Lógica de processamento de planilha (cálculo de 25%/40% FIPE e Desvio). Tela de Análise de Aprovação (Visualização e Aprovação Individual/Lote). | 3 Semanas |
| **Sprint 3** | **Módulo de Gestão Operacional** | Tela de Cadastro de Veículo (Inclusão Manual). Tela de Gestão de Status (Filtros e Ações de Regularização/Liberação). Integração com o sistema de autenticação. | 3 Semanas |
| **Sprint 4** | **Relatórios e Refinamento** | Implementação do Dashboard Principal (KPIs e Gráfico de Fluxo). Relatório de Auditoria. Testes de Usabilidade e Refinamento de UI/UX. | 2 Semanas |
| **Total** | | | **10 Semanas** |

---
### Referências

[1] Definição da Arquitetura e Stack Tecnológica: `plano_de_acao_salvados_fase1.md`.
[2] Definição do Escopo Funcional (Módulos e Telas): `plano_de_acao_salvados_fase2.md`.
[3] Elaboração do Plano de Ação Detalhado (Roadmap): `plano_de_acao_salvados_fase3.md`.
