# Descoberta da API FIPE no Projeto S4

## 1. API Identificada

*   **URL Base:** `https://fipe.parallelum.com.br/api/v2`
*   **Localização no Código:** `s4-site/app/api/fipe/route.ts` (Linha 3)

## 2. Análise do Código

O projeto S4 utiliza a mesma API que foi identificada na pesquisa anterior: a **Fipe API (fipe.online)**, que é um serviço de terceiros que replica os dados da FIPE.

O código em `route.ts` atua como um *proxy* de API:
1.  Recebe uma requisição para `/api/fipe`.
2.  Extrai o `path` da *query string* (ex: `cars/brands/59/models/5940/years/2014-3`).
3.  Encaminha a requisição para a URL base da Fipe API: `https://fipe.parallelum.com.br/api/v2/${path}`.
4.  Retorna a resposta para o frontend.

## 3. Implicações para o Sistema Salvados

*   **Reutilização:** A API é a mesma. O sistema Salvados **pode e deve** reutilizar essa API.
*   **Vantagem:** A reutilização garante a consistência dos dados de FIPE entre os sistemas S4 e Salvados.
*   **Desvantagem/Risco:** A API continua sendo de terceiros e possui a limitação de **1.000 requisições/dia** (no plano gratuito com token). O uso compartilhado entre S4 e Salvados pode levar ao esgotamento mais rápido do limite diário.

## 4. Recomendação

A recomendação anterior de implementar uma estratégia de **caching robusta no PostgreSQL** para o sistema Salvados se torna ainda mais **CRÍTICA**. O Salvados deve ser projetado para **minimizar ao máximo** as requisições à API externa, dependendo primariamente do *cache* local.

## 5. Próximos Passos

Elaborar o relatório final de análise e recomendação, confirmando a API e reforçando a necessidade da estratégia de *caching*.
