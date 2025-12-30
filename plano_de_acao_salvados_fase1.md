# Plano de Ação - Fase 1: Definição da Arquitetura e Stack Tecnológica

## 1. Contexto e Objetivo

O objetivo é criar o sistema **Salvados** (`https://salvados.administradoramutual.com.br/`) para centralizar a gestão de veículos indenizados, substituindo o fluxo manual via Google Sheets. O sistema deve permitir a importação de planilhas de leilão, análise de conformidade e aprovação individualizada de vendas.

## 2. Arquitetura Técnica Proposta

Para garantir a **performance, escalabilidade e alinhamento** com a infraestrutura existente da Administradora Mutual (conforme observado em `s4.administradoramutual.com.br`), a seguinte *stack* tecnológica é recomendada:

| Componente | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Framework Full-stack** | **Next.js 14** (App Router) com **TypeScript** | Alinhamento com o ecossistema Vercel e o site `s4`. Oferece roteamento avançado, renderização híbrida (SSR/SSG/ISR) e segurança de tipos. |
| **Estilização** | **Tailwind CSS** | Desenvolvimento rápido e consistente, utilizando classes utilitárias para garantir um design responsivo e moderno. |
| **Banco de Dados** | **PostgreSQL** (Gerenciado, ex: Neon/Supabase) | Robustez, escalabilidade e suporte nativo a JSONB (ideal para armazenar dados flexíveis de planilhas de leilão). |
| **ORM/Acesso a Dados** | **Drizzle ORM** | ORM moderno, *type-safe* e leve, que permite escrever consultas SQL de forma segura e com tipagem completa. |
| **Hospedagem/CI/CD** | **Vercel** | Integração contínua e *deploy* automatizado, aproveitando a infraestrutura já utilizada pela Administradora Mutual. |
| **Autenticação** | **Integração com `sistemas.administradoramutual.com.br`** | Utilizar o sistema de autenticação existente para garantir um *Single Sign-On* (SSO) e gestão centralizada de usuários. |

## 3. Estrutura de Dados (Modelo Preliminar)

O sistema será construído em torno de duas entidades principais:

### A. Tabela `Veiculo`

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | UUID | Chave primária. |
| `placa` | String (Unique) | Placa do veículo (chave de identificação principal). |
| `marca` | String | Marca do veículo. |
| `modelo` | String | Modelo do veículo. |
| `fipe_valor` | Decimal | Valor da Tabela FIPE. |
| `situacao` | Enum | 'Sucata' ou 'Recuperavel'. |
| `data_entrada` | Date | Data de entrada no pátio. |
| `status_venda` | Enum | 'Novo No Pátio', 'Venda Autorizada', 'Vendido e Recebido', etc. (Espelha as abas da planilha). |
| `valor_sugerido` | Decimal | Valor calculado com base na regra (25% ou 40% FIPE). |
| `valor_alcancado` | Decimal | Valor real de venda (se vendido). |
| `aprovacao_status` | Enum | 'Pendente', 'Aprovado', 'Rejeitado'. |
| `aprovacao_data` | Date | Data da última aprovação/rejeição. |

### B. Tabela `ImportacaoLeilao`

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | UUID | Chave primária. |
| `nome_arquivo` | String | Nome do arquivo original (ex: MAISBRASIL-10.12.25-Autorizada.xlsx). |
| `data_importacao` | Timestamp | Data e hora da importação. |
| `importado_por` | UUID | ID do usuário que realizou o upload. |
| `status_processamento` | Enum | 'Pendente', 'Processando', 'Concluído', 'Erro'. |
| `dados_brutos` | JSONB | Armazenamento dos dados brutos da planilha para auditoria. |

## 4. Próximos Passos

Avançar para a **Fase 2: Definição do Escopo Funcional (Módulos e Telas)**, detalhando como as funcionalidades solicitadas serão implementadas na interface do usuário.
