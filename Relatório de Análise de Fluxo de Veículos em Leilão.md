# Relatório de Análise de Fluxo de Veículos em Leilão

**Objetivo:** Analisar a planilha do Google Sheets fornecida, abrangendo todas as abas, para mapear o fluxo de veículos no processo de leilão, identificar gargalos e extrair métricas de performance.

**Fonte de Dados:** Planilha Google Sheets "RELATORIO VEICULOS NO PATIO _ NOVA" [1].

## 1. Mapeamento do Fluxo de Veículos

O processo de leilão é bem estruturado e pode ser visualizado através das abas da planilha, que representam as etapas do fluxo:

| Etapa do Fluxo | Aba da Planilha | Quantidade de Veículos | Status e Implicação |
| :--- | :--- | :--- | :--- |
| **Entrada** | Novos No Pátio | 4 | Veículos recém-chegados, com o maior potencial de retorno sugerido (41,32% da FIPE). |
| **Preparação** | Venda Autorizada | 16 | Veículos avaliados e liberados para venda. |
| **Conclusão** | Vendido e Recebido | 144 | **Fluxo concluído com sucesso.** Representa a maior parte do volume. |
| **Gargalo Financeiro** | Vendido e Não Recebido | 10 | Veículos vendidos, mas com pagamento ou regularização pendente. **Risco de inadimplência.** |
| **Bloqueio** | Proibia a Venda | 10 | Veículos impedidos de serem leiloados por restrições. |
| **Exceção** | Ocorrência | 1 | Veículo em situação atípica, requerendo atenção individualizada. |
| **Total Geral** | Resumo | **185** | Volume total de veículos gerenciados. |

## 2. Análise de Performance e Gargalos Críticos

A análise da aba **Resumo** revela uma diferença significativa entre o valor esperado e o valor real alcançado, além de identificar um gargalo de risco financeiro.

### 2.1. Performance de Retorno (Valor Sugerido vs. Valor Vendido)

A performance geral do leilão está abaixo da expectativa de retorno sugerida.

| Indicador | Valor (R$) | Retorno (%) |
| :--- | :--- | :--- |
| **Valor Sugerido (Esperado)** | **R$ 3.118.457,65** | **32,52%** da FIPE |
| **Valor Vendido (Real)** | **R$ 2.549.376,00** | **26,58%** da FIPE |
| **Desvio Negativo Total** | **R$ 569.081,65** | **-5,94%** |

O valor real de venda está **R$ 569.081,65 abaixo** do valor sugerido, indicando que a precificação (Valor Sugerido) baseada nas regras de 25% e 40% da FIPE pode estar **otimista** e não alinhada com o preço de reserva atingível no mercado de leilões.

### 2.2. Gargalo de Risco Financeiro: "Vendido e Não Recebido"

A categoria **Vendido e Não Recebido** é o ponto de maior risco financeiro e operacional.

*   **Volume:** 10 veículos.
*   **Valor Vendido em Risco:** **R$ 218.500,00**.
*   **Retorno Percentual:** 39,94% da FIPE (o maior retorno percentual da tabela).

**Implicação:** Embora esses veículos tenham sido vendidos com um excelente retorno, o fato de o pagamento/regularização estar pendente representa um risco de inadimplência de **R$ 218.500,00**. A alta taxa de retorno sugere que são veículos de alto valor, o que torna a pendência ainda mais crítica.

## 3. Recomendações Estratégicas

1.  **Ajuste da Precificação (Valor Sugerido):**
    *   Revisar as regras de cálculo do **Valor Sugerido** (25% e 40% da FIPE) para alinhá-las com o **Retorno Real** de 26,58%.
    *   Ajustar o valor sugerido para um patamar mais realista, reduzindo o desvio negativo e otimizando a expectativa de caixa.

2.  **Ação Imediata no Gargalo:**
    *   Priorizar a regularização dos **10 veículos** na aba **Vendido e Não Recebido**. A liberação desses **R$ 218.500,00** é crucial para o fluxo de caixa.
    *   Estabelecer um prazo máximo para a regularização, após o qual a venda deve ser cancelada e o veículo realocado para um novo leilão.

3.  **Liberação de Capital Bloqueado:**
    *   Investigar e resolver as restrições dos **10 veículos** na aba **Proibia a Venda** (R$ 283.121,00 em FIPE) para liberar esse capital para leilão.

4.  **Priorização de Venda:**
    *   Priorizar a venda dos **4 veículos** na aba **Novos No Pátio**, pois eles apresentam o maior potencial de retorno sugerido (41,32%).

---
### Referências

[1] Planilha Google Sheets: `https://docs.google.com/spreadsheets/d/1M6cez9KsP0KdvkYrcwITd4eMkA10KpYUmPxIvNGCmEI/edit?usp=sharing`.
[2] Dados extraídos da aba 'Resumo': `dados_resumo_leilao.md`.
[3] Dados extraídos da aba 'Novos No Pátio': `dados_novos_no_patio.md`.
[4] Dados extraídos da aba 'Venda Autorizada': `dados_venda_autorizada.md`.
[5] Dados extraídos da aba 'Vendido e Não Recebido': `dados_vendido_nao_recebido.md`.
[6] Dados extraídos da aba 'Vendido e Recebido' (Amostra): `dados_vendido_recebido_parte1.md`.
[7] Dados extraídos da aba 'Ocorrência': `dados_ocorrencia.md`.
[8] Dados extraídos da aba 'Proibia a Venda': `dados_proibia_venda.md`.
