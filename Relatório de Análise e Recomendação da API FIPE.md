# Relatório de Análise e Recomendação da API FIPE

## 1. Descoberta da API no Projeto S4

Conforme solicitado, o acesso ao projeto **S4-Site** (`s4.administradoramutual.com.br`) via MCP e a inspeção do código-fonte revelaram a API livre utilizada para a calculadora:

> **API Identificada:** `https://fipe.parallelum.com.br/api/v2` (Fipe API - fipe.online)

A API é utilizada através de um *endpoint* de *proxy* (`/api/fipe/route.ts`) no Next.js, que encaminha as requisições do frontend para o serviço externo [1].

## 2. Análise de Reutilização para o Sistema Salvados

| Critério | Avaliação | Implicação para o Salvados |
| :--- | :--- | :--- |
| **Consistência de Dados** | **Alta.** Reutilizar a mesma API garante que os valores FIPE no S4 e no Salvados sejam idênticos. | **Recomendado.** Mantém a integridade dos dados entre os sistemas. |
| **Facilidade de Integração** | **Alta.** O código de *proxy* já existe e pode ser adaptado. | **Recomendado.** Reduz o tempo de desenvolvimento. |
| **Limitação de Requisições** | **Crítica.** A API gratuita limita a **1.000 requisições por dia** (com token) [2]. | **Risco Elevado.** O uso compartilhado entre S4 e Salvados pode esgotar o limite rapidamente, impactando a funcionalidade de ambos. |
| **Atualização** | Mensal. | **Adequado.** A Tabela FIPE é atualizada mensalmente. |

## 3. Recomendação Final: Reutilização com Estratégia de Caching

A reutilização da API é a melhor abordagem, mas deve ser acompanhada de uma estratégia de mitigação de risco para o limite de requisições.

### A. Ação Recomendada: Implementação de Cache no PostgreSQL

O sistema Salvados deve ser projetado para **minimizar ao máximo** as requisições à API externa, utilizando o PostgreSQL como um *cache* de dados FIPE.

| Estratégia | Detalhe | Benefício |
| :--- | :--- | :--- |
| **Cache de Valores FIPE** | Armazenar o valor FIPE obtido para cada veículo (Marca, Modelo, Ano) na tabela `Veiculo` ou em uma tabela de *cache* dedicada. | **Redução de Requisições:** Se o valor FIPE de um veículo já foi consultado, o sistema o utiliza do banco de dados local, economizando requisições à API externa. |
| **Cache de Metadados** | Armazenar a lista de Marcas, Modelos e o Código de Referência FIPE mais atual. | **Performance:** Acelera a busca por metadados e garante que todas as consultas usem a mesma referência mensal. |

### B. Plano de Ação Reforçado (Sprint 2)

O **Sprint 2** do Plano de Ação deve ser focado na implementação desta lógica de *caching*:

1.  **Desenvolvimento da Lógica de *Caching*:** Criar a estrutura de banco de dados e a lógica de *backend* para armazenar e consultar os valores FIPE localmente.
2.  **Lógica de *Fallback*:** Se a API externa falhar (limite excedido), o sistema deve notificar o usuário e utilizar o último valor FIPE conhecido do *cache* (se disponível) ou marcar o veículo para reprocessamento.

## 4. Próximos Passos

Com a confirmação da API, o desenvolvimento do sistema Salvados pode prosseguir com a certeza de que a fonte de dados FIPE é consistente com os demais sistemas da Administradora Mutual.

---
### Referências

[1] Código-fonte do S4-Site (`s4-site/app/api/fipe/route.ts`).
[2] Fipe API (fipe.online) - Limitações de Uso: `https://deividfortuna.github.io/fipe/v2/`.
[3] Descoberta da API FIPE no Projeto S4: `fipe_api_s4_descoberta.md`.
