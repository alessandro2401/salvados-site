# Plano de Ação - Fase 3: Elaboração do Plano de Ação Detalhado (Roadmap)

## 1. Roadmap de Desenvolvimento do Sistema Salvados

O desenvolvimento será dividido em 4 Sprints (etapas de trabalho), com foco na entrega de valor incremental, começando pelo fluxo de dados e terminando com a experiência do usuário e relatórios.

| Sprint | Foco Principal | Entregáveis Chave | Duração Estimada |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | **Infraestrutura e Dados** | Configuração do Next.js, Banco de Dados (PostgreSQL), Drizzle ORM. Implementação do modelo de dados (`Veiculo` e `ImportacaoLeilao`). | 2 Semanas |
| **Sprint 2** | **Módulo de Importação e Aprovação (MVP)** | Tela de Upload de Planilha. Lógica de processamento de planilha (cálculo de 25%/40% FIPE e Desvio). Tela de Análise de Aprovação (Visualização e Aprovação Individual/Lote). | 3 Semanas |
| **Sprint 3** | **Módulo de Gestão Operacional** | Tela de Cadastro de Veículo (Inclusão Manual). Tela de Gestão de Status (Filtros e Ações de Regularização/Liberação). Integração com o sistema de autenticação (`sistemas.administradoramutual.com.br`). | 3 Semanas |
| **Sprint 4** | **Relatórios e Refinamento** | Implementação do Dashboard Principal (KPIs e Gráfico de Fluxo). Relatório de Auditoria (Histórico de Aprovações/Importação). Testes de Usabilidade e Refinamento de UI/UX. | 2 Semanas |
| **Total** | | | **10 Semanas** |

## 2. Detalhamento das Tarefas por Sprint

### Sprint 1: Infraestrutura e Dados (2 Semanas)

| Tarefa | Descrição |
| :--- | :--- |
| **1.1** | Configuração do projeto Next.js 14 (App Router) com TypeScript e Tailwind CSS. |
| **1.2** | Provisionamento do Banco de Dados PostgreSQL (ex: Neon/Supabase). |
| **1.3** | Configuração do Drizzle ORM e definição dos schemas `Veiculo` e `ImportacaoLeilao`. |
| **1.4** | Criação de *endpoints* de API para CRUD básico da tabela `Veiculo`. |
| **1.5** | Configuração do ambiente de CI/CD no Vercel. |

### Sprint 2: Módulo de Importação e Aprovação (3 Semanas)

| Tarefa | Descrição |
| :--- | :--- |
| **2.1** | Desenvolvimento da **Tela de Upload de Planilha** (`.xlsx`). |
| **2.2** | Implementação da lógica de *backend* para leitura e processamento da planilha (cálculo de 25%/40% FIPE, Desvio R$/%). |
| **2.3** | Desenvolvimento da **Tela de Análise de Aprovação** (listagem dos veículos importados). |
| **2.4** | Implementação da funcionalidade de **Aprovação/Rejeição Individual** por placa (com campo de justificativa). |
| **2.5** | Implementação da funcionalidade de **Aprovação em Lote** (para veículos que atendem ao Valor Sugerido). |

### Sprint 3: Módulo de Gestão Operacional (3 Semanas)

| Tarefa | Descrição |
| :--- | :--- |
| **3.1** | Desenvolvimento da **Tela de Cadastro de Veículo** (Inclusão Manual). |
| **3.2** | Desenvolvimento da **Tela de Gestão de Status** (listagem principal com filtros por status). |
| **3.3** | Implementação das ações de **Regularização** ("Vendido e Não Recebido" -> "Vendido e Recebido" ou "Venda Cancelada"). |
| **3.4** | Implementação das ações de **Liberação** ("Proibida a Venda" -> "Venda Autorizada"). |
| **3.5** | Integração com o sistema de autenticação existente (`sistemas.administradoramutual.com.br`). |

### Sprint 4: Relatórios e Refinamento (2 Semanas)

| Tarefa | Descrição |
| :--- | :--- |
| **4.1** | Desenvolvimento do **Dashboard Principal** (KPIs, Gráfico de Fluxo). |
| **4.2** | Desenvolvimento do **Relatório de Auditoria** (Histórico de Aprovações/Importação). |
| **4.3** | Revisão de UI/UX e testes de usabilidade. |
| **4.4** | Documentação técnica final do projeto. |

## 3. Próximos Passos

Avançar para a **Fase 4: Revisão e Entrega do Plano de Ação para Aprovação do Usuário**, consolidando as informações das Fases 1, 2 e 3 em um único documento para aprovação.
