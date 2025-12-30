# Relatório de Requisitos Técnicos e de Infraestrutura para Salvados.AdministradoraMutual.com.br

## 1. Visão Geral

Este relatório detalha os requisitos técnicos e de infraestrutura necessários para hospedar o novo sistema de gestão de veículos salvados (`Salvados`) no Vercel, garantindo a integração com o subdomínio, o provisionamento do banco de dados e a segurança das credenciais.

## 2. Requisitos de Infraestrutura Vercel e DNS

O projeto será configurado no Vercel para aproveitar a *stack* Next.js e o fluxo de CI/CD existente.

| Requisito | Detalhe | Ação Necessária |
| :--- | :--- | :--- |
| **Criação do Projeto** | Novo projeto Vercel a partir do repositório Git (ex: `administradora-mutual-salvados`). | Criar o repositório e importar para o Vercel. |
| **Subdomínio** | `salvados.administradoramutual.com.br` | **Configuração de DNS:** Adicionar o domínio no painel Vercel e configurar o registro **CNAME** ou **A** no provedor de DNS de `administradoramutual.com.br` conforme instruído pelo Vercel. |
| **Framework** | Next.js 14 (App Router) com TypeScript. | Configuração padrão do Vercel. |
| **CI/CD** | *Deploy* automático a cada *push* para a *branch* principal. | Configuração padrão do Vercel. |

## 3. Requisitos de Banco de Dados PostgreSQL

Um banco de dados PostgreSQL gerenciado é essencial para a robustez e escalabilidade do sistema.

| Requisito | Detalhe | Ação Necessária |
| :--- | :--- | :--- |
| **Serviço** | **PostgreSQL Gerenciado** (Ex: Neon, Supabase, AWS RDS). | Provisionar uma instância de PostgreSQL. |
| **Conexão** | **Serverless-friendly** (via *pooling* ou *proxy*) para otimizar o desempenho das *Serverless Functions* do Vercel. | Obter a *connection string* otimizada. |
| **Segurança** | Conexão via SSL/TLS. | Garantir que a *connection string* inclua `sslmode=require`. |
| **Schema Inicial** | Tabelas `Veiculo` e `ImportacaoLeilao` definidas via Drizzle ORM. | Executar as migrações iniciais. |

## 4. Variáveis de Ambiente (Secrets)

Todas as credenciais devem ser armazenadas como **Environment Variables (Secrets)** no painel do Vercel, configuradas para os ambientes de *Preview* e *Production*.

### A. Variáveis de Conexão com o Banco de Dados

| Variável | Uso | Observações |
| :--- | :--- | :--- |
| `DATABASE_URL` | String de conexão completa com o PostgreSQL. | **CRÍTICO:** Deve ser mantida em segredo. |

### B. Variáveis de Autenticação (SSO)

Essas variáveis são necessárias para a integração com o sistema de autenticação central (`sistemas.administradoramutual.com.br`).

| Variável | Uso | Observações |
| :--- | :--- | :--- |
| `AUTH_SECRET` | Chave secreta para criptografia de sessões (NextAuth.js). | Deve ser uma string longa e aleatória. |
| `AUTH_CLIENT_ID` | ID do cliente fornecido pelo provedor de SSO. | Identificador público do aplicativo Salvados. |
| `AUTH_CLIENT_SECRET` | Segredo do cliente fornecido pelo provedor de SSO. | **CRÍTICO:** Deve ser mantida em segredo. |
| `AUTH_ISSUER_URL` | URL do provedor de autenticação. | Ex: `https://sistemas.administradoramutual.com.br/auth` |
| `NEXTAUTH_URL` | URL pública do sistema Salvados. | `https://salvados.administradoramutual.com.br` |

### C. Variáveis de Processamento de Planilha

| Variável | Uso | Observações |
| :--- | :--- | :--- |
| `FIPE_SUCATA_PERCENT` | Percentual de retorno esperado para Sucata. | `0.25` |
| `FIPE_RECUPERAVEL_PERCENT` | Percentual de retorno esperado para Recuperável. | `0.40` |

## 5. Próximos Passos

Com a aprovação deste relatório, a equipe de infraestrutura pode iniciar o provisionamento do banco de dados e a configuração do DNS, enquanto a equipe de desenvolvimento inicia o **Sprint 1** do Plano de Ação (Configuração do Next.js e Drizzle ORM).

---
### Referências

[1] Requisitos de Infraestrutura Vercel e DNS: `requisitos_infra_fase1.md`.
[2] Requisitos de Banco de Dados e Variáveis de Ambiente: `requisitos_infra_fase2.md`.
[3] Plano de Ação Completo: `plano_de_acao_salvados_final.md`.
