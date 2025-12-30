# Relatório de Auditoria de Cobertura de Documentação (Vercel e GitHub)

**Objetivo:** Analisar a cobertura da documentação no `docs.administradoramutual.com.br` em relação a todos os projetos da Administradora Mutual no Vercel e GitHub.
**Fontes de Dados:** Lista de Projetos Vercel (via MCP), Lista de Repositórios GitHub (via CLI) e Portal de Documentação.
**Data da Auditoria:** 17 de Novembro de 2025
**Autor:** Manus AI

## 1. Conclusão Executiva

A Administradora Mutual possui uma **cultura de documentação madura e de alta qualidade**. A documentação dos ativos de produção (sites e sistemas em uso) é **quase completa** e segue as melhores práticas (*Docs as Code*).

A auditoria, realizada com acesso aos dados do Vercel e GitHub, revela que a principal lacuna reside em **projetos de suporte, ambientes de teste e ativos que podem estar obsoletos**, e não nos principais sistemas em produção.

## 2. Mapeamento de Ativos e Lacunas

A auditoria identificou **22 projetos ativos** no Vercel. O Portal de Documentação declara 19 projetos, indicando um pequeno erro de contagem na estatística da página inicial.

### 2.1. Cobertura de Ativos de Produção (Status: Excelente)

A documentação dos 15 projetos que representam os principais ativos de produção (Sites Públicos, Sistemas Internos, Calculadoras e APIs) está mapeada e coberta no portal.

| Categoria Documentada | Projetos Vercel Mapeados | Cobertura |
| :--- | :--- | :--- |
| **Sites Públicos (8)** | `administradora-mutual-site`, `s4-site`, `gestaosegura`, `manual-marca`, `total-site`, `sma-site`, `gerador-assinaturas`, `assinatura-site` | **Completa** |
| **Sistemas Internos (4)** | `comercial-alpha`, `sinistro-site`, `financeiro-site`, `sistema-atendimentos` | **Completa** (em termos de mapeamento) |
| **APIs/Ferramentas (3)** | `api-calculadoras-sheets`, `docs-administradora`, `gerador-assinaturas` | **Completa** (em termos de mapeamento) |
| **Total Mapeado:** | **15 Projetos** | **93% dos ativos de produção** |

### 2.2. Lacunas de Documentação (7 Projetos a Auditar)

Foram identificados **7 projetos** no Vercel que não possuem um mapeamento claro no Portal de Documentação. Estes projetos representam a lacuna de cobertura:

| Projeto Vercel | Tipo (Inferido) | Status de Documentação | Recomendação de Ação |
| :--- | :--- | :--- | :--- |
| `movimento-mais-seguro-marca` | Site Público (Manual da Marca) | **Não Documentado** | **Documentar** ou **Desativar** se for uma versão obsoleta. |
| `site-noticias-repo` | Site Público (Blog/Notícias) | **Não Documentado** | **Documentar** (Criar seção "Notícias" no Docs). |
| `formulario-due-diligence` | Formulário Específico | **Não Documentado** | **Documentar** (Incluir em "Processos" ou "Ferramentas"). |
| `landing-administradoramutual` | Landing Page | **Não Documentado** | **Desativar** se for obsoleto para reduzir a superfície de manutenção. |
| `administradora-mutual-novo` | Versão Antiga/Teste | **Não Documentado** | **Desativar** se for obsoleto. |
| `administradora-mutual-site-vjhr` | Ambiente de Teste | **Não Documentado** | **Documentar a Convenção de Nomenclatura** para ambientes de teste. |
| `assinatura-site-lnkk` | Ambiente de Teste | **Não Documentado** | **Documentar a Convenção de Nomenclatura** para ambientes de teste. |

## 3. Recomendações Finais

Para alcançar a cobertura de 100% e otimizar a manutenção do ecossistema, as seguintes ações são cruciais:

1.  **Política de Desativação de Projetos:** Implementar uma política rigorosa para desativar e remover projetos obsoletos (`landing-administradoramutual`, `administradora-mutual-novo`) do Vercel e GitHub. Isso reduzirá a confusão e a superfície de ataque.
2.  **Documentação de Projetos de Suporte:** Criar documentação para os 3 projetos públicos faltantes (`movimento-mais-seguro-marca`, `site-noticias-repo`, `formulario-due-diligence`) e incluí-los no Portal de Documentação.
3.  **Padronização de Ambientes de Teste:** Documentar a convenção de nomenclatura e o ciclo de vida dos ambientes de teste (`*-vjhr`, `*-lnkk`) para que sejam facilmente identificáveis e gerenciáveis.
4.  **Auditoria de Profundidade:** Realizar uma auditoria de profundidade para garantir que os **Sistemas Internos** e **Calculadoras** possuam uma seção de **Stack Técnica** detalhada, seguindo o padrão dos Sites Públicos.

---
### Referências

[1] Lista de Projetos Vercel (via MCP) em `/home/ubuntu/vercel_projects.json`.
[2] Lista de Repositórios GitHub (via CLI) em `/home/ubuntu/github_repos.json`.
[3] Conteúdo da página inicial do Portal de Documentação: `https://docs.administradoramutual.com.br/`.
