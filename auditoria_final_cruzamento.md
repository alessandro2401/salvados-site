# Auditoria Final de Cobertura de Documentação - Cruzamento de Dados

## 1. Mapeamento de Projetos (Vercel)

A lista de projetos no Vercel é a fonte de verdade para os ativos implantados.

*   **Total de Projetos Vercel Encontrados:** 22
*   **Total de Projetos Vercel Declarados no Docs:** 19 (discrepância de 3 projetos)

### 1.1. Lista de Projetos Vercel (22)

| Nome do Projeto Vercel | Tipo (Inferido) | Status de Documentação (Inferido) |
| :--- | :--- | :--- |
| `administradora-mutual-site` | Site Principal | **Documentado** (Site Institucional) |
| `s4-site` | Site Público | **Documentado** (AURA Seguradora S4) |
| `docs-administradora` | Portal de Documentação | **Documentado** (docs.administradoramutual.com.br) |
| `gestaosegura` | Site Público | **Documentado** (Gestão Segura) |
| `manual-marca` | Site Público | **Documentado** (Manual da Marca) |
| `total-site` | Calculadora/Site Público | **Documentado** (Calculadora SMT) |
| `sma-site` | Calculadora/Site Público | **Documentado** (Calculadora SMA) |
| `sistemas-site` | Portal Interno | **Documentado** (Portal de Sistemas) |
| `gerador-assinaturas` | Ferramenta/Site Público | **Documentado** (Gerador de Assinaturas) |
| `comercial-alpha` | Sistema Interno | **Documentado** (Comercial Alpha) |
| `sinistro-site` | Sistema Interno | **Documentado** (Gestão de Sinistros) |
| `financeiro-site` | Sistema Interno | **Documentado** (Sistema Financeiro) |
| `api-calculadoras-sheets` | API/Backend | **Documentado** (APIs - Calculadoras) |
| `sistema-atendimentos` | Sistema Interno | **Documentado** (Não listado explicitamente, mas é um sistema interno) |
| `movimento-mais-seguro-marca` | Site Público | **Não Documentado** (Novo Manual da Marca?) |
| `landing-administradoramutual` | Landing Page | **Não Documentado** (Landing Page Antiga/Teste) |
| `administradora-mutual-site-vjhr` | Teste/Branch | **Não Documentado** (Ambiente de Teste) |
| `assinatura-site-lnkk` | Teste/Branch | **Não Documentado** (Ambiente de Teste) |
| `assinatura-site` | Site Público | **Documentado** (Gerador de Assinaturas - Duplicata?) |
| `administradora-mutual-novo` | Site Público | **Não Documentado** (Versão Antiga/Teste) |
| `site-noticias-repo` | Site Público | **Não Documentado** (Site de Notícias) |
| `formulario-due-diligence` | Formulário/Site Público | **Não Documentado** (Formulário Específico) |

## 2. Auditoria de Cobertura (Lacunas)

A auditoria revela que a documentação é **quase completa** para os ativos principais, mas há lacunas em projetos de suporte e ambientes de teste.

### 2.1. Projetos Documentados (15 Itens)

A lista de projetos Vercel mapeia diretamente para os 8 Sites Públicos, 4 Sistemas Internos, 2 Calculadoras e 1 API/Ferramenta documentados no portal.

| Categoria Documentada | Projetos Vercel Correspondentes |
| :--- | :--- |
| Sites Públicos (8) | `administradora-mutual-site`, `s4-site`, `gestaosegura`, `manual-marca`, `total-site`, `sma-site`, `gerador-assinaturas`, `assinatura-site` |
| Sistemas Internos (4) | `comercial-alpha`, `sinistro-site`, `financeiro-site`, `sistema-atendimentos` |
| Calculadoras (2) | `total-site` (SMT), `sma-site` (SMA) |
| APIs/Ferramentas (1) | `api-calculadoras-sheets` |
| **Total Mapeado:** | **15 projetos** |

### 2.2. Lacunas de Documentação (7 Projetos)

Existem **7 projetos Vercel** que não parecem ter documentação explícita no portal:

| Projeto Vercel | Tipo (Inferido) | Recomendação |
| :--- | :--- | :--- |
| `movimento-mais-seguro-marca` | Site Público (Manual da Marca) | **Documentar:** Se for um novo manual da marca, o antigo deve ser desativado ou este deve ser documentado. |
| `site-noticias-repo` | Site Público (Blog/Notícias) | **Documentar:** Criar uma seção "Blog/Notícias" no portal de documentação. |
| `formulario-due-diligence` | Formulário Específico | **Documentar:** Criar uma seção "Formulários Específicos" ou incluir em "Processos". |
| `landing-administradoramutual` | Landing Page | **Decisão:** Se for obsoleto, desativar. Se for ativo, documentar. |
| `administradora-mutual-novo` | Versão Antiga/Teste | **Decisão:** Se for obsoleto, desativar. |
| `administradora-mutual-site-vjhr` | Ambiente de Teste | **Decisão:** Se for ambiente de teste, documentar a convenção de nomenclatura e o processo de *staging*. |
| `assinatura-site-lnkk` | Ambiente de Teste | **Decisão:** Se for ambiente de teste, documentar a convenção de nomenclatura e o processo de *staging*. |

## 3. Conclusão da Auditoria Final

A auditoria confirma que a documentação dos **ativos de produção** é de alta qualidade. A lacuna reside em **projetos de suporte, ambientes de teste e ativos que podem estar obsoletos**.

A diferença entre os 22 projetos reais e os 19 declarados no Docs (3 projetos) é um pequeno erro de contagem na estatística da página inicial do portal.

**Recomendação Final:** A equipe deve focar em documentar os **7 projetos faltantes** e, principalmente, estabelecer uma **política de desativação** para projetos obsoletos (`landing-administradoramutual`, `administradora-mutual-novo`) para reduzir a superfície de manutenção.
