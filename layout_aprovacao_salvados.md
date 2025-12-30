# Estrutura do Layout: Página de Análise de Aprovação de Vendas

## 1. Título e Contexto

*   **Título Principal:** Análise de Aprovação de Vendas
*   **Subtítulo:** Planilha de Leilão Importada: `MAISBRASIL-10.12.25-Autorizada.xlsx` (Importado por: [Usuário] em [Data/Hora])

## 2. Cartões de Métricas (KPIs)

Três cartões de destaque na parte superior da tela para resumir a performance da planilha importada:

| Cartão | Título | Valor | Cor de Destaque |
| :--- | :--- | :--- | :--- |
| **1** | Valor Esperado de Retorno | R$ 203.814,15 | Azul (Neutro) |
| **2** | Valor Alcançado (Vendido) | R$ 132.550,00 | Laranja (Atenção) |
| **3** | Desvio Total | -R$ 71.264,15 (-34.97%) | Vermelho (Risco) |

## 3. Ações em Lote (Batch Actions)

Botões de ação global acima da tabela:

*   **Botão 1:** **Aprovar Vendas Acima do Sugerido** (Cor Verde)
    *   *Descrição:* Aprova automaticamente todos os veículos cujo Valor Alcançado é maior ou igual ao Valor Sugerido.
*   **Botão 2:** **Exportar para Análise** (Cor Cinza)
    *   *Descrição:* Exporta a tabela atualizada para Excel/CSV.

## 4. Tabela de Veículos (Análise Individual)

A tabela principal deve listar os veículos e permitir a ação individual de aprovação/rejeição.

| Coluna | Conteúdo | Destaque Visual |
| :--- | :--- | :--- |
| **Placa** | Ex: OMO0C22 | Chave de identificação. |
| **Modelo** | Ex: UNO Uno Vivace 1.0 Evo | |
| **FIPE (R$)** | Ex: R$ 31.592,00 | |
| **Tipo** | Ex: Sucata / Recuperável | |
| **Valor Sugerido (R$)** | Ex: R$ 7.898,00 | |
| **Valor Alcançado (R$)** | Ex: R$ 4.400,00 | |
| **Desvio (R$/%)** | Ex: -R$ 3.498,00 (-44.29%) | **Cor:** Vermelho se negativo, Verde se positivo. |
| **Status** | Ex: Pendente de Aprovação | |
| **Ações** | **Botão 1:** Aprovar (Verde) / **Botão 2:** Rejeitar (Vermelho) | Botões de ação rápida. |

## 5. Exemplo de Linhas na Tabela

| Placa | Modelo | Desvio (R$/%) | Ações |
| :--- | :--- | :--- | :--- |
| OMO0C22 | UNO Uno Vivace 1.0 Evo | -R$ 3.498,00 (-44.29%) | [Aprovar] [Rejeitar] |
| NTK9J74 | L200 TRITON | +R$ 1.000,00 (+4.56%) | [Aprovar] [Rejeitar] |
| QDL7G25 | HR-V HR-V EXL | -R$ 10.000,00 (-29.49%) | [Aprovar] [Rejeitar] |
| PQH1B90 | COROLLA Corolla XEi | -R$ 14.536,25 (-58.18%) | [Aprovar] [Rejeitar] |

## 6. Requisitos de Interação (Modal de Rejeição)

*   Ao clicar em **Rejeitar**, um *modal* deve ser exibido.
*   **Campo Obrigatório:** Justificativa da Rejeição.
*   **Ação:** A rejeição deve mover o veículo para o status "Proibida a Venda" ou "Venda Cancelada" no sistema.
