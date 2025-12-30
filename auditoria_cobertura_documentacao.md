# Auditoria de Cobertura de Documentação - Administradora Mutual

## 1. Mapeamento de Projetos e Sistemas

A auditoria de cobertura foi baseada nas informações fornecidas pelo próprio Portal de Documentação (`docs.administradoramutual.com.br`), que é a fonte mais confiável para o mapeamento do ecossistema digital.

### 1.1. Projetos Identificados (Vercel/GitHub)

O portal de documentação declara explicitamente o seguinte:

*   **Total de Projetos Identificados no Vercel:** **19 projetos** [1].
*   **Total de Sites/Sistemas Documentados (Explícitos):** **8 sites/subdomínios** [1].

### 1.2. Cobertura Documentada (Mapeamento de Seções)

O portal organiza a documentação em categorias que cobrem o ecossistema digital da empresa:

| Categoria | Sub-itens Documentados | Status da Cobertura |
| :--- | :--- | :--- |
| **Sites Públicos** | 8 sites/subdomínios (incluindo o site principal e o S4) | Cobertura explícita de 8 projetos. |
| **Calculadoras** | SMA - Socorro Mútuo Acordo, SMT - Socorro Mútuo Total | Cobertura de 2 calculadoras. |
| **Sistemas Internos** | Portal de Sistemas, Comercial Alpha, Gestão de Sinistros, Sistema Financeiro | Cobertura de 4 sistemas internos. |
| **Ferramentas** | Gerador de Assinaturas (e outras ferramentas) | Cobertura de 1 ferramenta explícita. |
| **APIs** | Documentação técnica das APIs e integrações | Cobertura de APIs (detalhes não inspecionados). |
| **Processos** | Procedimentos Operacionais Padrão (POP) | Cobertura de Processos. |
| **Identidade Visual** | Manual da marca completo | Cobertura de Marca. |
| **Suporte** | FAQ, contatos e solicitação de acesso | Cobertura de Suporte. |

## 2. Análise de Lacunas (Gap Analysis)

A principal lacuna identificada é a diferença entre o número total de projetos no Vercel e o número de sites/sistemas explicitamente listados.

### 2.1. Lacuna Quantitativa (19 vs. 8)

*   **Projetos no Vercel:** 19
*   **Sites/Subdomínios Listados:** 8
*   **Diferença:** **11 projetos**

**Conclusão:** Há uma diferença de 11 projetos no Vercel que **não estão listados** na seção "Sites Públicos" do portal.

**Hipóteses para a Diferença:**
1.  **Projetos Internos/Privados:** Os 11 projetos restantes podem ser *backends*, *APIs*, *microsserviços*, *testes* ou *ambientes de staging* que não possuem um subdomínio público ou não são considerados "sites" no sentido tradicional.
2.  **Projetos Documentados em Outras Seções:** Alguns desses projetos podem estar documentados nas seções "Sistemas Internos" (4 itens), "Calculadoras" (2 itens) ou "Ferramentas" (1 item), totalizando 7 itens.
3.  **Projetos Não Documentados:** A diferença restante (11 - 7 = 4) pode representar projetos que ainda não foram documentados.

### 2.2. Lacuna Qualitativa (Profundidade)

A profundidade da documentação para os 8 sites listados é **Alta**, pois o portal oferece:
*   **Documentação Geral**
*   **Stack Técnica** (incluindo versões de frameworks, como visto na análise do site principal e do S4).

A documentação dos **Sistemas Internos** (4 itens) e **Calculadoras** (2 itens) está presente, mas a auditoria não pôde verificar a profundidade da "Stack Técnica" para cada um desses itens, o que é crucial para a manutenção.

## 3. Conclusão da Auditoria

A Administradora Mutual possui uma **excelente cultura de documentação** com um portal centralizado e automatizado.

*   **O que está documentado:** Todos os 8 sites/subdomínios públicos principais estão mapeados e documentados com detalhes técnicos. As categorias de Sistemas Internos, Calculadoras, APIs e Processos também estão cobertas.
*   **O que precisa de atenção:** A principal lacuna é a **discrepância de 11 projetos** entre o total de projetos no Vercel (19) e os sites listados (8).

## 4. Recomendações

1.  **Mapeamento de Projetos Não Listados:** A equipe técnica deve confirmar se os 11 projetos restantes no Vercel estão devidamente documentados nas seções "Sistemas Internos", "APIs" ou "Ferramentas".
2.  **Auditoria de Profundidade:** Garantir que todos os itens listados nas seções "Sistemas Internos" e "Calculadoras" também possuam uma seção de **Stack Técnica** detalhada, seguindo o padrão dos "Sites Públicos".
3.  **Atualização da Estatística:** Se a diferença de 11 projetos for intencional (ex: projetos de teste), a estatística na página inicial deve ser ajustada para "X projetos públicos documentados" vs. "Y projetos internos documentados" para maior clareza.

---
### Referências

[1] Conteúdo da página inicial do Portal de Documentação: `https://docs.administradoramutual.com.br/`.
[2] Seção "Sites Públicos" do Portal de Documentação: `https://docs.administradoramutual.com.br/sites-publicos/`.
[3] Seção "Sistemas Internos" do Portal de Documentação: `https://docs.administradoramutual.com.br/sistemas-internos/`.
