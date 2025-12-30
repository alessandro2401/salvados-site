# Plano de Ação - Fase 2: Definição do Escopo Funcional (Módulos e Telas)

## 1. Módulos Principais

O sistema **Salvados** será dividido em três módulos principais para gerenciar o ciclo de vida dos veículos:

1.  **Módulo de Importação e Aprovação (Fluxo de Leilão)**
2.  **Módulo de Cadastro e Gestão (Fluxo Operacional)**
3.  **Módulo de Relatórios e Dashboards (Visão Estratégica)**

## 2. Detalhamento das Telas e Funcionalidades

### 2.1. Módulo de Importação e Aprovação (Foco na Planilha do Leilão)

| Tela | Funcionalidades Chave |
| :--- | :--- |
| **Upload de Planilha** | 1. **Upload:** Permitir o upload de arquivos `.xlsx` (planilhas de leilão). |
| | 2. **Processamento:** O sistema deve processar a planilha, aplicar as regras de cálculo (25% Sucata / 40% Recuperável) e calcular o **Valor Sugerido** e o **Desvio** em relação ao **Valor Alcançado** (Valor Vendido). |
| **Análise de Aprovação** | 1. **Visualização Consolidada:** Exibir a lista de veículos da planilha, destacando o **Desvio Negativo** (Valor Alcançado < Valor Sugerido). |
| | 2. **Aprovação Individual:** Botão de **Aprovar Venda** ou **Rejeitar Venda** para cada placa. |
| | 3. **Aprovação em Lote:** Opção de aprovar todos os veículos que atingiram ou superaram o Valor Sugerido. |
| | 4. **Justificativa:** Campo obrigatório para justificar a **Rejeição** ou a **Aprovação** de vendas com desvio negativo significativo. |

### 2.2. Módulo de Cadastro e Gestão (Foco no Fluxo Operacional)

| Tela | Funcionalidades Chave |
| :--- | :--- |
| **Cadastro de Veículo** | 1. **Inclusão Manual:** Formulário para colaboradores incluírem novos veículos (Placa, Marca, Modelo, FIPE, Data de Entrada, Situação: Sucata/Recuperável). |
| | 2. **Atualização de Status:** Campo para atualizar o status do veículo (Ex: "Novo No Pátio" para "Venda Autorizada"). |
| **Gestão de Status** | 1. **Filtros por Status:** Filtrar a lista de veículos pelas situações da planilha (Novos No Pátio, Venda Autorizada, Vendido e Não Recebido, Vendido e Recebido, Proibida a Venda, Ocorrência). |
| | 2. **Ação de Regularização:** Para "Vendido e Não Recebido", botão para marcar como "Recebido" ou "Venda Cancelada". |
| | 3. **Ação de Liberação:** Para "Proibida a Venda", botão para marcar como "Liberado para Venda" após a resolução da restrição. |

### 2.3. Módulo de Relatórios e Dashboards (Foco na Visão Estratégica)

| Tela | Funcionalidades Chave |
| :--- | :--- |
| **Dashboard Principal** | 1. **Métricas Chave (KPIs):** Exibir o Valor Total FIPE, Valor Total Sugerido, Valor Total Vendido e o Desvio Total (R$ e %). |
| | 2. **Gráfico de Fluxo:** Visualização do funil de veículos por status (similar ao gráfico da aba "Resumo"). |
| | 3. **Top Desvios:** Lista dos veículos com maior desvio negativo (perda) e positivo (ganho) em relação ao Valor Sugerido. |
| **Relatório de Auditoria** | 1. **Histórico de Aprovações:** Rastrear quem aprovou/rejeitou cada venda e a justificativa. |
| | 2. **Histórico de Importação:** Rastrear todas as planilhas de leilão importadas. |

## 3. Próximos Passos

Avançar para a **Fase 3: Elaboração do Plano de Ação Detalhado (Roadmap)**, definindo as etapas de desenvolvimento e os prazos estimados.
