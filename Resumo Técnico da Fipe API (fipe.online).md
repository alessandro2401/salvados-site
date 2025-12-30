# Resumo Técnico da Fipe API (fipe.online)

Este documento consolida as informações técnicas essenciais da Fipe API, que será utilizada para obter o valor FIPE atualizado no sistema Salvados.

## 1. Informações Gerais

| Item | Detalhe |
| :--- | :--- |
| **Endpoint Base** | `https://fipe.parallelum.com.br/api/v2` |
| **Autenticação** | Token de Assinatura (`X-Subscription-Token`) no cabeçalho. |
| **Limitação** | 1.000 requisições/dia (com token gratuito). |
| **Atualização** | Mensal (seguindo a Tabela FIPE oficial). |

## 2. Fluxo de Consulta para Obter o Valor FIPE

Para obter o valor FIPE de um veículo, o sistema Salvados deve seguir a seguinte sequência de requisições, utilizando o **código de referência** mais atual:

### Passo 1: Obter o Código de Referência Atual

| Endpoint | Método | Parâmetros | Uso |
| :--- | :--- | :--- | :--- |
| `/references` | `GET` | Nenhum (além do token) | Retorna o mês e o código de referência FIPE mais atual. |

### Passo 2: Obter o Valor FIPE Final

Este é o endpoint crucial para o sistema Salvados. Ele retorna o preço médio do veículo.

| Endpoint | Método | Parâmetros de Path | Parâmetros de Query |
| :--- | :--- | :--- | :--- |
| `/{vehicleType}/brands/{brandId}/models/{modelId}/years/{yearId}` | `GET` | `vehicleType` (cars, motorcycles, trucks), `brandId`, `modelId`, `yearId` | `reference` (código obtido no Passo 1) |

**Exemplo de Resposta (Informações da Fipe):**

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `price` | string | Preço em Real brasileiro (Ex: R$ 10.000,00) |
| `codeFipe` | string | Identificador único da Fipe (Ex: 005340-6) |
| `brand` | string | Marca do veículo (Ex: VW - VolksWagen) |
| `modelYear` | integer | Ano de fabricação do veículo (Ex: 2014) |

## 3. Endpoints de Mapeamento (Para Cache Local)

Estes endpoints são importantes para construir o *cache* local de Marcas, Modelos e Anos, minimizando as requisições ao endpoint final.

| Endpoint | Método | Uso |
| :--- | :--- | :--- |
| `/{vehicleType}/brands` | `GET` | Retorna as marcas por tipo de veículo. |
| `/{vehicleType}/brands/{brandId}/models` | `GET` | Retorna os modelos para a marca. |
| `/{vehicleType}/brands/{brandId}/models/{modelId}/years` | `GET` | Retorna os anos para o modelo específico. |

## 4. Requisito de Integração no Salvados

O sistema Salvados deve ser capaz de:

1.  **Mapear** a string de **Marca/Modelo/Ano** da planilha de leilão para os **IDs numéricos** exigidos pela API (`brandId`, `modelId`, `yearId`).
2.  **Armazenar** o valor `price` e o `codeFipe` no banco de dados local (PostgreSQL) para evitar consultas repetidas.

---
### Referências

[1] Documentação Oficial da Fipe API: `https://fipe.online/docs/api/fipe`.
[2] Endpoint Base da Fipe API: `https://fipe.parallelum.com.br/api/v2`.
