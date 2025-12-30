# Relatório de Opções e Plano de Implementação da Tabela FIPE Automática

## 1. Opções para Obtenção da Tabela FIPE

A obtenção da Tabela FIPE de forma automática e confiável é um desafio, pois a Fundação FIPE **não oferece uma API oficial** para uso comercial [1]. A solução mais viável é utilizar APIs de terceiros que replicam e mantêm os dados da FIPE.

A pesquisa identificou a **Fipe API (fipe.online)** como a opção mais robusta e documentada para integração [2].

| Opção | Vantagens | Desvantagens |
| :--- | :--- | :--- |
| **Fipe API (fipe.online)** | Gratuita para uso limitado, excelente documentação, atualizada mensalmente, modelo RESTful JSON. | **Limitação de Requisições:** 1.000 requisições/dia no plano gratuito com token. |
| **Outras APIs Pagas** | Requisições ilimitadas, acesso a histórico de preços. | Custo de aquisição e manutenção. |
| **Web Scraping** | Potencialmente gratuita. | **Alto Risco:** Ilegal, instável (quebra a cada mudança no site da FIPE), exige manutenção constante e pode levar a bloqueios de IP. |

**Recomendação:** Iniciar com a **Fipe API (fipe.online)** no plano gratuito com token, monitorando o consumo de requisições. Se o volume de importações exceder o limite, migrar para um plano pago ou para uma API de terceiros com maior capacidade.

## 2. Plano de Implementação da FIPE Automática

A integração da FIPE será realizada no *backend* do sistema Salvados (Next.js Serverless Functions) e deve ser um passo crítico no **Sprint 2** (Módulo de Importação e Aprovação).

### 2.1. Estratégia de Integração

A estratégia deve focar na minimização do número de requisições à API externa, utilizando o banco de dados PostgreSQL como um *cache* local.

| Etapa | Descrição | Justificativa |
| :--- | :--- | :--- |
| **1. Cache de Referência** | Obter o código de referência da FIPE mais atual (`GET /references`) e armazená-lo no banco de dados. | A referência muda apenas uma vez por mês. Evita requisições desnecessárias. |
| **2. Cache de Marcas/Modelos** | Criar tabelas de *cache* para Marcas e Modelos. | Evita a repetição de requisições para dados estáticos. |
| **3. Processamento da Planilha** | Ao importar a planilha, o sistema deve: | |
| | a. Tentar encontrar o valor FIPE na tabela `Veiculo` (se já cadastrado). | Prioriza o dado local. |
| | b. Se não encontrado, usar a API externa (`GET /{vehicleType}/brands/{brandId}/models/{modelId}/years/{yearId}`) para obter o valor. | Último recurso, consome requisição. |
| | c. **Armazenar o valor FIPE obtido** na tabela `Veiculo` para consultas futuras. | Popula o *cache* local. |

### 2.2. Requisitos Técnicos Adicionais

| Requisito | Detalhe |
| :--- | :--- |
| **Variável de Ambiente** | Armazenar o token de acesso da Fipe API como `FIPE_API_TOKEN` no Vercel. |
| **Lógica de Mapeamento** | Implementar uma lógica robusta para mapear a string de **Marca/Modelo/Ano** da planilha para os IDs numéricos exigidos pela API da FIPE. |
| **Tratamento de Erros** | Implementar um mecanismo de *retry* e *fallback* para lidar com falhas de conexão ou limites de requisição excedidos. |

## 3. Conclusão

A integração da Tabela FIPE automática é totalmente viável utilizando a **Fipe API (fipe.online)**. O sucesso a longo prazo dependerá da implementação de uma estratégia de *caching* eficiente no PostgreSQL para gerenciar o limite de 1.000 requisições diárias.

---
### Referências

[1] Tabela Fipe - Fundação Instituto de Pesquisas Econômicas: `https://veiculos.fipe.org.br/`.
[2] Fipe API (Deivid Fortuna / fipe.online): `https://deividfortuna.github.io/fipe/v2/`.
[3] Análise da API FIPE: `fipe_api_analise.md`.
