# Análise da API FIPE (Deivid Fortuna / fipe.online)

## 1. Visão Geral da API

*   **URL Base:** `https://fipe.parallelum.com.br/api/v2/`
*   **Atualização:** Mensalmente, com dados extraídos da Tabela FIPE oficial.
*   **Modelo:** RESTful JSON.
*   **Funcionalidade:** Permite consultar referências de meses, marcas, modelos, anos e o preço final do veículo.

## 2. Limitações e Requisitos de Uso

*   **Uso Gratuito:** Limitado a **500 requisições não autenticadas por dia (24h)**.
*   **Uso com Token Gratuito:** Até **1.000 requisições por dia (24h)**, mediante criação de um token gratuito.
*   **Uso Ilimitado/Histórico:** Requer a contratação de um plano de suporte (pago).

## 3. Relevância para o Sistema Salvados

A API é altamente relevante, mas a limitação de 1.000 requisições/dia pode ser um problema, dependendo do volume de veículos a serem processados.

*   **Fluxo de Importação:** Para cada veículo na planilha de leilão, serão necessárias **múltiplas requisições** para obter o valor FIPE exato (Marca -> Modelo -> Ano -> Valor Final).
*   **Exemplo:** Uma planilha com 100 veículos pode facilmente consumir 400 a 500 requisições em um único processamento.

## 4. Endpoints Chave para o Sistema Salvados

| Endpoint | Descrição | Uso no Salvados |
| :--- | :--- | :--- |
| `GET /references` | Retorna os códigos de referência de meses. | Obter o código da FIPE mais atual para todas as consultas. |
| `GET /{vehicleType}/brands` | Retorna as marcas por tipo de veículo. | Necessário para mapear a marca do veículo da planilha. |
| `GET /{vehicleType}/brands/{brandId}/models/{modelId}/years/{yearId}` | **Retorna o valor FIPE final.** | **Endpoint CRÍTICO.** Usado para obter o valor FIPE para o cálculo do Valor Sugerido. |

## 5. Próximos Passos

Avançar para a **Fase 2: Elaborar o Relatório de Opções e Plano de Implementação da FIPE Automática**, detalhando o plano de integração e as considerações sobre a limitação de requisições.
