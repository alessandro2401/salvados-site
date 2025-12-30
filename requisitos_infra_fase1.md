# Requisitos de Infraestrutura - Fase 1: Vercel e DNS

## 1. Configuração do Projeto no Vercel

O sistema **Salvados** será configurado como um novo projeto na conta Vercel da Administradora Mutual.

| Requisito | Detalhe | Ação Necessária |
| :--- | :--- | :--- |
| **Criação do Projeto** | O projeto deve ser criado a partir do repositório Git (GitHub/GitLab/Bitbucket) que hospedará o código-fonte do sistema Salvados. | Criar um novo repositório Git (ex: `administradora-mutual-salvados`) e importar para o Vercel. |
| **Framework Preset** | O Vercel deve detectar automaticamente o framework **Next.js** e configurar as otimizações de *build* e *deploy* necessárias. | Configuração padrão do Vercel para projetos Next.js. |
| **Root Directory** | Se o código estiver em um monorepo, o *Root Directory* deve ser configurado para o diretório específico do projeto Salvados. | Configurar o caminho correto no painel de configurações do projeto Vercel. |
| **Build Command** | O comando de *build* padrão do Next.js (`next build`) deve ser mantido. | `next build` |
| **Output Directory** | O diretório de saída padrão (`.next`) deve ser mantido. | `.next` |

## 2. Configuração de DNS (Subdomínio salvados.administradoramutual.com.br)

Para que o sistema seja acessível pelo subdomínio desejado, é necessário configurar o registro DNS apropriado.

| Tipo de Registro | Hostname | Valor | Observações |
| :--- | :--- | :--- | :--- |
| **A** ou **CNAME** | `salvados` | **Depende da configuração do Vercel.** Se o domínio `administradoramutual.com.br` estiver gerenciado pelo Vercel, a configuração é automática. | Se o domínio não estiver no Vercel, será necessário criar um registro **CNAME** apontando para o *alias* do Vercel (ex: `cname.vercel-dns.com`). |

**Ação Necessária:**

1.  No painel do Vercel, adicionar o domínio `salvados.administradoramutual.com.br` ao projeto.
2.  O Vercel fornecerá o registro DNS exato (geralmente um registro `A` ou `CNAME`) que deve ser adicionado ao provedor de DNS de `administradoramutual.com.br`.

## 3. Integração com o Sistema de Autenticação

O sistema Salvados deve ser configurado para ser um sub-aplicativo do `sistemas.administradoramutual.com.br`.

| Requisito | Detalhe | Ação Necessária |
| :--- | :--- | :--- |
| **SSO/Autenticação** | O sistema Salvados não deve ter sua própria lógica de login. Deve redirecionar para o sistema de autenticação central (`sistemas.administradoramutual.com.br`) e receber um *token* de volta. | Configurar o Next.js para usar um provedor de autenticação (ex: NextAuth.js) que se integre ao SSO existente (provavelmente via OAuth 2.0 ou OpenID Connect). |
| **Variáveis de Ambiente** | Serão necessárias variáveis de ambiente para a configuração do SSO (ex: `AUTH_CLIENT_ID`, `AUTH_CLIENT_SECRET`, `AUTH_ISSUER_URL`). | Definir e configurar essas variáveis no Vercel (Fase 2). |

## 4. Próximos Passos

Avançar para a **Fase 2: Detalhar Requisitos de Banco de Dados e Variáveis de Ambiente**, detalhando o provisionamento do PostgreSQL e a lista completa de segredos.
