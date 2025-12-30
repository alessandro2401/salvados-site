# Requisitos de Infraestrutura - Fase 2: Banco de Dados e Variáveis de Ambiente

## 1. Provisionamento do Banco de Dados PostgreSQL

O sistema Salvados requer um banco de dados PostgreSQL robusto e escalável.

| Requisito | Detalhe | Ação Necessária |
| :--- | :--- | :--- |
| **Serviço** | **PostgreSQL Gerenciado** (Ex: Neon, Supabase, AWS RDS, etc.). | Provisionar uma instância de PostgreSQL com capacidade de escalabilidade vertical e horizontal. |
| **Conexão** | **Conexão Serverless** (via *pooling* ou *proxy*) é altamente recomendada para o ambiente Vercel (Next.js Serverless Functions). | Configurar o provedor de banco de dados para fornecer uma *connection string* otimizada para ambientes *serverless*. |
| **Segurança** | O acesso deve ser restrito ao IP de saída do Vercel (se possível) e a conexão deve ser feita via SSL/TLS. | Garantir que a *connection string* inclua parâmetros de segurança (ex: `sslmode=require`). |
| **Schema Inicial** | O schema inicial deve incluir as tabelas `Veiculo` e `ImportacaoLeilao` (conforme definido na Fase 1 do Plano de Ação). | Executar as migrações iniciais do Drizzle ORM após o provisionamento. |

## 2. Variáveis de Ambiente (Secrets)

Todas as credenciais e chaves de acesso devem ser armazenadas como **Environment Variables (Secrets)** no painel do Vercel para garantir a segurança.

### A. Variáveis de Conexão com o Banco de Dados

| Variável | Uso | Exemplo de Valor |
| :--- | :--- | :--- |
| `DATABASE_URL` | String de conexão completa com o PostgreSQL. | `postgresql://user:password@host:port/database?sslmode=require` |
| `DB_HOST` | Host do servidor de banco de dados. | `ep-silent-smoke-12345.us-east-2.aws.neon.tech` |
| `DB_USER` | Usuário do banco de dados. | `drizzle_user` |
| `DB_PASSWORD` | Senha do banco de dados. | `s3cr3t_p4ssw0rd` |

### B. Variáveis de Autenticação (SSO)

Essas variáveis são necessárias para a integração com o sistema de autenticação central (`sistemas.administradoramutual.com.br`).

| Variável | Uso | Observações |
| :--- | :--- | :--- |
| `AUTH_SECRET` | Chave secreta para criptografia de sessões (NextAuth.js). | Deve ser uma string longa e aleatória. |
| `AUTH_CLIENT_ID` | ID do cliente fornecido pelo provedor de SSO. | Ex: `salvados-app-client-id` |
| `AUTH_CLIENT_SECRET` | Segredo do cliente fornecido pelo provedor de SSO. | Chave confidencial. |
| `AUTH_ISSUER_URL` | URL do provedor de autenticação (para descoberta de endpoints). | Ex: `https://sistemas.administradoramutual.com.br/auth` |
| `NEXTAUTH_URL` | URL pública do sistema Salvados. | `https://salvados.administradoramutual.com.br` |

### C. Variáveis de Processamento de Planilha

| Variável | Uso | Observações |
| :--- | :--- | :--- |
| `FIPE_SUCATA_PERCENT` | Percentual de retorno esperado para Sucata. | `0.25` |
| `FIPE_RECUPERAVEL_PERCENT` | Percentual de retorno esperado para Recuperável. | `0.40` |

## 3. Próximos Passos

Avançar para a **Fase 3: Elaborar o Relatório Final de Requisitos Técnicos e de Infraestrutura**, consolidando as informações das Fases 1 e 2 em um único documento para aprovação.
