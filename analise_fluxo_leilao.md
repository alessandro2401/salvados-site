# Análise de Fluxo de Veículos no Leilão

## 1. Mapeamento do Fluxo de Veículos

Com base nas abas da planilha, o fluxo de veículos pode ser mapeado da seguinte forma:

1.  **Novos No Pátio (4 veículos):** Veículos recém-chegados, aguardando avaliação e autorização de venda.
2.  **Venda Autorizada (16 veículos):** Veículos avaliados e liberados para leilão.
3.  **Vendido e Não Recebido (10 veículos):** Veículos vendidos no leilão, mas o pagamento/regularização ainda está pendente.
4.  **Vendido e Recebido (144 veículos):** Veículos vendidos e com o processo de pagamento/regularização concluído.
5.  **Proibia a Venda (10 veículos):** Veículos que, por algum motivo (restrição, documentação, etc.), não podem ser leiloados.
6.  **Ocorrência (1 veículo):** Veículo com alguma pendência ou situação atípica.

## 2. Métricas Chave (Extraídas da Aba 'Resumo')

| Situações | Qtd | Fipe (R$) | Valor Sugerido (R$) | Retorno (%) | Valor Vendido (R$) | Retorno Real (%) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Total Geral** | **185** | **9.590.689,00** | **3.118.457,65** | **32,52%** | **2.549.376,00** | **26,58%** |
| Novo No Pátio | 4 | 310.394,00 | 128.250,60 | 41,32% | - | 0,00% |
| Venda Autorizada | 16 | 765.972,00 | 268.513,15 | 35,06% | - | 0,00% |
| Vendido e Não Recebido | 10 | 547.056,00 | 204.634,70 | 37,41% | 218.500,00 | 39,94% |
| Vendido e Recebido | 144 | 7.675.443,00 | 2.447.822,45 | 31,89% | 2.330.876,00 | 30,37% |
| Proibida a Venda | 10 | 283.121,00 | 67.931,30 | 23,99% | - | 0,00% |
| Ocorrência | 1 | 8.703,00 | 1.305,45 | 15,00% | - | 0,00% |

## 3. Análise de Performance e Gargalos

### A. Performance de Venda (Vendido vs. Esperado)

*   **Retorno Esperado (Valor Sugerido):** 32,52% da FIPE.
*   **Retorno Real (Valor Vendido):** 26,58% da FIPE.
*   **Desvio Negativo Total:** **-5,94%** (32,52% - 26,58%) ou **R$ 569.081,65** (R$ 3.118.457,65 - R$ 2.549.376,00).

O valor vendido está **R$ 569.081,65 abaixo** do valor sugerido, indicando que o preço de reserva/sugerido não está sendo atingido consistentemente.

### B. Gargalo de Recebimento (Vendido e Não Recebido)

*   **10 veículos** foram vendidos, mas o pagamento/regularização **não foi recebido**.
*   O valor FIPE desses veículos é de **R$ 547.056,00**.
*   O **Valor Vendido** desses 10 veículos é de **R$ 218.500,00**, com um Retorno Real de **39,94%** (o melhor retorno percentual da tabela).
*   **Atenção:** O alto percentual de retorno (39,94%) sugere que esses veículos são de alto valor e/ou foram vendidos com sucesso, mas o risco de não recebimento/regularização é um **gargalo financeiro e operacional** significativo.

### C. Eficiência do Processo (Novos No Pátio vs. Venda Autorizada)

*   **Novos No Pátio:** 4 veículos.
*   **Venda Autorizada:** 16 veículos.
*   A taxa de retorno sugerida para os **Novos No Pátio (41,32%)** é a mais alta de todas as categorias, indicando que são veículos de melhor qualidade/condição.
*   **Recomendação:** Priorizar a venda desses 4 veículos de alto potencial de retorno.

### D. Risco Operacional (Proibida a Venda)

*   **10 veículos** estão com a venda proibida, totalizando **R$ 283.121,00** em valor FIPE.
*   A resolução desses impedimentos é crucial para liberar capital.

## 4. Conclusão do Fluxo

O fluxo geral está funcionando (144 veículos vendidos e recebidos), mas há dois pontos críticos:

1.  **Perda de Retorno:** O valor real de venda está significativamente abaixo do valor sugerido, indicando que a precificação (Valor Sugerido) precisa ser ajustada ou o processo de leilão precisa ser otimizado para atingir o preço de reserva.
2.  **Risco de Inadimplência/Regularização:** A categoria "Vendido e Não Recebido" representa um risco de **R$ 218.500,00** em vendas não finalizadas, exigindo atenção imediata para a regularização ou cancelamento da venda.
