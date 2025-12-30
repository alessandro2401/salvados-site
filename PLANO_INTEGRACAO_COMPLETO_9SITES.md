# Plano de Ação Completo - Integração de 9 Sites no Painel Administrativo Centralizado

**Documento:** Plano de Integração Técnica
**Versão:** 2.0
**Data:** 15 de Dezembro de 2025
**Status:** Pronto para Implementação
**Autor:** Manus AI

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura Técnica Recomendada](#2-arquitetura-técnica-recomendada)
3. [Localização no Site](#3-localização-no-site)
4. [Estrutura de Banco de Dados](#4-estrutura-de-banco-de-dados)
5. [APIs e Endpoints](#5-apis-e-endpoints)
6. [Fluxo de Integração](#6-fluxo-de-integração)
7. [Roadmap de Implementação](#7-roadmap-de-implementação)
8. [Checklist de Integração](#8-checklist-de-integração)
9. [Segurança e Compliance](#9-segurança-e-compliance)
10. [Testes e Validação](#10-testes-e-validação)

---

## 1. Visão Geral do Projeto

### 1.1 Objetivo Principal

Consolidar o gerenciamento de **9 sites** em um único painel administrativo centralizado (administradoramutual.com.br) que permita:

- ✅ Monitoramento em tempo real de status e performance
- ✅ Gerenciamento centralizado de funcionalidades
- ✅ Alertas automáticos para instabilidades
- ✅ Relatórios consolidados de uptime e performance
- ✅ Controle de acesso e permissões por site
- ✅ Histórico completo de eventos e incidentes

### 1.2 Sites a Integrar

| # | Site | URL | Tipo | Prioridade |
|---|------|-----|------|-----------|
| 1 | Movimento Mais Brasil | https://www.movimentomaisbrasil.org.br/ | Corretora | P1 |
| 2 | Movimento Mais Seguro | https://www.movimentomaisseguro.com.br/ | Corretora | P1 |
| 3 | Mais Brasil Motorcycle | https://www.maisbrasilmotorcycle.com.br/ | Corretora | P1 |
| 4 | Potere BP Mensal | https://www.poterebpmensal.com.br/ | Consórcio | P1 |
| 5 | Potere Consórcio | https://www.potereconsorcio.com.br/ | Consórcio | P1 |
| 6 | Soluções Corretora | https://www.solucoescorretora.com.br/ | Corretora | P2 |
| 7 | Alpha Proteções | https://www.alphaprotecoes.com.br/ | Seguros | P2 |
| 8 | Grupo MMB | https://www.grupommb.com/ | Holding | P2 |
| 9 | Juntos Podemos Mais | https://www.juntospodmais.com.br/ | Comunidade | P3 |

### 1.3 Benefícios Esperados

- **Centralização:** Um único ponto de controle para todos os sites
- **Visibilidade:** Dashboard em tempo real com status de todos os sites
- **Reatividade:** Alertas automáticos para problemas
- **Eficiência:** Redução de tempo de resposta a incidentes
- **Conformidade:** Auditoria completa de todas as ações
- **Escalabilidade:** Fácil adição de novos sites no futuro

---

## 2. Arquitetura Técnica Recomendada

### 2.1 Componentes Principais

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ADMINISTRADOR MUTUAL (Central)                   │
│                  https://www.administradoramutual.com.br            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (React 19)                       │  │
│  │  • Dashboard                                                 │  │
│  │  • Gerenciamento de Sites                                   │  │
│  │  • Monitoramento em Tempo Real                              │  │
│  │  • Alertas e Notificações                                   │  │
│  │  • Relatórios                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  BACKEND (Node.js + Express)                │  │
│  │                                                              │  │
│  │  ┌─────────────────┐  ┌──────────────────┐                 │  │
│  │  │  tRPC Router    │  │  Health Check    │                 │  │
│  │  │  • sites        │  │  Service         │                 │  │
│  │  │  • monitoring   │  │  • Verificação   │                 │  │
│  │  │  • alerts       │  │  • Métricas      │                 │  │
│  │  │  • reports      │  │  • Alertas       │                 │  │
│  │  └─────────────────┘  └──────────────────┘                 │  │
│  │                                                              │  │
│  │  ┌─────────────────┐  ┌──────────────────┐                 │  │
│  │  │  Alert Engine   │  │  Notification    │                 │  │
│  │  │  • Classificar  │  │  Service         │                 │  │
│  │  │  • Criar alertas│  │  • Email         │                 │  │
│  │  │  • Resolver     │  │  • WhatsApp      │                 │  │
│  │  │  • Escalate     │  │  • SMS           │                 │  │
│  │  └─────────────────┘  └──────────────────┘                 │  │
│  │                                                              │  │
│  │  ┌─────────────────┐  ┌──────────────────┐                 │  │
│  │  │  WebSocket      │  │  Auth Service    │                 │  │
│  │  │  Server         │  │  • OAuth 2.0     │                 │  │
│  │  │  • Tempo Real   │  │  • JWT           │                 │  │
│  │  │  • Broadcast    │  │  • RBAC          │                 │  │
│  │  └─────────────────┘  └──────────────────┘                 │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              DATABASE (PostgreSQL + Drizzle ORM)            │  │
│  │  • sites                                                     │  │
│  │  • health_checks                                             │  │
│  │  • alertas                                                   │  │
│  │  • notificacoes                                              │  │
│  │  • usuarios                                                  │  │
│  │  • audit_log                                                 │  │
│  │  • integracao_config                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   CACHE (Redis)                              │  │
│  │  • Status em tempo real                                      │  │
│  │  • Métricas agregadas                                        │  │
│  │  • Sessões de usuário                                        │  │
│  │  • Rate limiting                                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
        │  Site 1-3        │  │  Site 4-5        │  │  Site 6-9        │
        │  (Movimento)     │  │  (Potere)        │  │  (Outros)        │
        │                  │  │                  │  │                  │
        │ GET /api/health  │  │ GET /api/health  │  │ GET /api/health  │
        │ POST /webhooks   │  │ POST /webhooks   │  │ POST /webhooks   │
        │ SDK Monitor.js   │  │ SDK Monitor.js   │  │ SDK Monitor.js   │
        └──────────────────┘  └──────────────────┘  └──────────────────┘
```

### 2.2 Stack Tecnológico

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Frontend** | React 19 + Tailwind 4 + shadcn/ui | Já em uso, moderno, responsivo |
| **Backend** | Node.js + Express + tRPC | Já em uso, type-safe, eficiente |
| **ORM** | Drizzle ORM | Já em uso, SQL-first, migrations |
| **Database** | PostgreSQL | Robusto, escalável, confiável |
| **Cache** | Redis | Performance, sessões, rate limiting |
| **Real-time** | WebSocket + Socket.io | Atualizações em tempo real |
| **Agendador** | node-cron | Health checks periódicos |
| **Email** | SendGrid ou Nodemailer | Notificações de alertas |
| **Deployment** | Vercel | Já em uso, serverless, CI/CD |

### 2.3 Padrões de Integração

#### Opção 1: Endpoint de Health Check (Recomendado)

Cada site expõe um endpoint `/api/health` que retorna o status:

```json
{
  "status": "ok",
  "timestamp": "2025-12-15T20:30:00Z",
  "version": "1.0.0",
  "uptime": 99.8,
  "database": "connected",
  "cache": "connected",
  "metrics": {
    "responseTime": 245,
    "errorRate": 0.2,
    "requestsPerMinute": 1250
  }
}
```

**Vantagens:**
- Simples de implementar
- Não requer mudanças no site
- Fácil de testar
- Escalável

**Implementação:** Cada site precisa expor este endpoint.

#### Opção 2: SDK de Monitoramento (Complementar)

Injetar script JavaScript nos sites para monitoramento frontend:

```html
<script src="https://admin.administradoramutual.com.br/sdk/monitor.js?site=movimento-mais-brasil"></script>
```

**Funcionalidades:**
- Monitora performance do frontend
- Rastreia erros de JavaScript
- Envia eventos de usuário
- Detecta problemas de carregamento

**Vantagens:**
- Visibilidade de problemas frontend
- Rastreamento de erros
- Análise de performance do usuário

#### Opção 3: Webhooks (Para Eventos Críticos)

Sites podem enviar eventos críticos para o painel:

```json
POST https://admin.administradoramutual.com.br/api/webhooks

{
  "site_id": "movimento-mais-brasil",
  "event": "database_error",
  "severity": "high",
  "message": "Connection timeout",
  "timestamp": "2025-12-15T20:30:00Z"
}
```

**Vantagens:**
- Notificação imediata de problemas
- Não depende de polling
- Flexível para eventos customizados

---

## 3. Localização no Site

### 3.1 Navegação Principal

```
administradoramutual.com.br/
│
├── / (Home)
│   └── Menu Principal
│       ├── Produtos
│       ├── Sobre
│       ├── 🔧 Painel Admin ← NOVO
│       └── Contato
│
├── /admin/ (Painel Administrativo - Protegido)
│   │
│   ├── /admin/dashboard
│   │   └── Status geral, alertas, uptime
│   │
│   ├── /admin/sites
│   │   ├── /admin/sites/list (Tabela de sites)
│   │   ├── /admin/sites/:id (Detalhes do site)
│   │   ├── /admin/sites/:id/config (Configurações)
│   │   └── /admin/sites/:id/logs (Logs)
│   │
│   ├── /admin/monitoramento
│   │   ├── /admin/monitoramento/tempo-real
│   │   ├── /admin/monitoramento/graficos
│   │   └── /admin/monitoramento/logs
│   │
│   ├── /admin/alertas
│   │   ├── /admin/alertas/ativos
│   │   ├── /admin/alertas/historico
│   │   └── /admin/alertas/configurar
│   │
│   ├── /admin/relatorios
│   │   ├── /admin/relatorios/uptime
│   │   ├── /admin/relatorios/performance
│   │   └── /admin/relatorios/incidentes
│   │
│   ├── /admin/usuarios
│   │   ├── /admin/usuarios/list
│   │   ├── /admin/usuarios/criar
│   │   └── /admin/usuarios/:id/editar
│   │
│   └── /admin/configuracoes
│       ├── /admin/configuracoes/sistema
│       ├── /admin/configuracoes/notificacoes
│       └── /admin/configuracoes/integracao
│
├── /gestao-segura/ (Já existente)
│   └── Análise de POPs
│
└── /processos-lista.html (Já existente)
    └── Lista de 51 processos
```

### 3.2 Layout do Painel Administrativo

```
┌─────────────────────────────────────────────────────────────────┐
│  Logo                        Administrador Mutual    👤 Perfil  │
├──────────────┬───────────────────────────────────────────────────┤
│              │                                                   │
│  Dashboard   │  ┌─────────────────────────────────────────────┐ │
│  Sites       │  │  STATUS GERAL                               │ │
│  Monitoring  │  │  🟢 8 Online  🟡 1 Degradado  🔴 0 Offline  │ │
│  Alertas     │  └─────────────────────────────────────────────┘ │
│  Relatórios  │                                                   │
│  Usuários    │  ┌─────────────────────────────────────────────┐ │
│  Config      │  │  ALERTAS RECENTES                           │ │
│              │  │  • Alpha Proteções - Tempo Alto (7.8s)      │ │
│              │  │  • Grupo MMB - Recuperado                   │ │
│              │  └─────────────────────────────────────────────┘ │
│              │                                                   │
│              │  ┌─────────────────────────────────────────────┐ │
│              │  │  UPTIME 24H                                 │ │
│              │  │  [Gráfico de linha]                         │ │
│              │  └─────────────────────────────────────────────┘ │
│              │                                                   │
└──────────────┴───────────────────────────────────────────────────┘
```

### 3.3 Acesso ao Painel

**URL:** `https://www.administradoramutual.com.br/admin/`

**Autenticação:** OAuth 2.0 + JWT

**Fluxo de Acesso:**
1. Usuário clica em "Painel Admin" no menu
2. Se não autenticado → Redireciona para login OAuth
3. Após login → Verifica role (admin, monitor, viewer)
4. Redireciona para dashboard com JWT token
5. Token armazenado em cookie seguro (httpOnly)

---

## 4. Estrutura de Banco de Dados

### 4.1 Tabela: sites

Armazena informações de cada site monitorado.

```sql
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL UNIQUE,
  url VARCHAR(255) NOT NULL UNIQUE,
  tipo ENUM('corretora', 'consorcio', 'seguros', 'holding', 'comunidade') NOT NULL,
  descricao TEXT,
  
  -- Configuração de Monitoramento
  ativo BOOLEAN DEFAULT true,
  intervalo_verificacao INTEGER DEFAULT 300, -- segundos (5 min)
  timeout INTEGER DEFAULT 30, -- segundos
  
  -- Endpoints
  endpoint_health VARCHAR(255) NOT NULL,
  endpoint_webhook VARCHAR(255),
  
  -- Credenciais (criptografadas)
  api_key VARCHAR(255),
  api_secret VARCHAR(255),
  
  -- Contatos
  email_responsavel VARCHAR(255),
  telefone_responsavel VARCHAR(20),
  
  -- Thresholds de Alerta
  threshold_tempo_resposta INTEGER DEFAULT 5000, -- ms
  threshold_taxa_erro DECIMAL(5,2) DEFAULT 5.0, -- %
  threshold_uptime DECIMAL(5,2) DEFAULT 95.0, -- %
  
  -- Metadata
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  deletado_em TIMESTAMP,
  
  INDEX(ativo, criado_em),
  INDEX(tipo),
  INDEX(deletado_em)
);
```

### 4.2 Tabela: health_checks

Histórico de verificações de saúde de cada site.

```sql
CREATE TABLE health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id),
  
  -- Status
  status ENUM('online', 'offline', 'timeout', 'error') NOT NULL,
  codigo_http INTEGER,
  mensagem_erro TEXT,
  
  -- Métricas
  tempo_resposta INTEGER, -- ms
  taxa_erro DECIMAL(5,2), -- %
  requisicoes_por_minuto INTEGER,
  
  -- Componentes
  database_status ENUM('connected', 'disconnected', 'unknown'),
  cache_status ENUM('connected', 'disconnected', 'unknown'),
  ssl_status ENUM('valid', 'expired', 'invalid', 'unknown'),
  
  -- Timestamp
  verificado_em TIMESTAMP DEFAULT NOW(),
  
  INDEX(site_id, verificado_em),
  INDEX(status, verificado_em),
  INDEX(verificado_em)
);
```

### 4.3 Tabela: alertas

Registro de alertas gerados.

```sql
CREATE TABLE alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id),
  
  -- Tipo e Severidade
  tipo ENUM('offline', 'tempo_alto', 'erro_alto', 'ssl', 'quota', 'db_error', 'cache_error') NOT NULL,
  severidade ENUM('baixa', 'media', 'alta', 'critica') NOT NULL,
  
  -- Conteúdo
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  
  -- Status
  resolvido BOOLEAN DEFAULT false,
  criado_em TIMESTAMP DEFAULT NOW(),
  resolvido_em TIMESTAMP,
  resolvido_por UUID REFERENCES usuarios(id),
  
  -- Notificações
  email_enviado BOOLEAN DEFAULT false,
  whatsapp_enviado BOOLEAN DEFAULT false,
  sms_enviado BOOLEAN DEFAULT false,
  push_enviado BOOLEAN DEFAULT false,
  
  -- Rastreamento
  tentativas_notificacao INTEGER DEFAULT 0,
  proxima_tentativa TIMESTAMP,
  
  INDEX(site_id, criado_em),
  INDEX(severidade, resolvido),
  INDEX(criado_em)
);
```

### 4.4 Tabela: notificacoes

Log de todas as notificações enviadas.

```sql
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alerta_id UUID NOT NULL REFERENCES alertas(id),
  
  -- Tipo
  tipo ENUM('email', 'whatsapp', 'sms', 'push') NOT NULL,
  
  -- Destinatário
  destinatario VARCHAR(255) NOT NULL,
  
  -- Conteúdo
  assunto VARCHAR(255),
  corpo TEXT NOT NULL,
  
  -- Status
  status ENUM('enviado', 'falha', 'bounce', 'lido') DEFAULT 'enviado',
  erro_mensagem TEXT,
  
  -- Timestamp
  enviado_em TIMESTAMP DEFAULT NOW(),
  entregue_em TIMESTAMP,
  
  INDEX(alerta_id, enviado_em),
  INDEX(tipo, status),
  INDEX(enviado_em)
);
```

### 4.5 Tabela: usuarios

Usuários do painel administrativo.

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Autenticação
  email VARCHAR(255) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  
  -- Permissões
  role ENUM('admin', 'monitor', 'viewer') DEFAULT 'viewer',
  sites_permitidos UUID[] DEFAULT ARRAY[]::UUID[], -- NULL = todos
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT NOW(),
  ultimo_acesso TIMESTAMP,
  
  INDEX(email),
  INDEX(role)
);
```

### 4.6 Tabela: audit_log

Auditoria de todas as ações no painel.

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  
  -- Ação
  acao VARCHAR(255) NOT NULL,
  recurso VARCHAR(255) NOT NULL,
  recurso_id UUID,
  
  -- Dados
  dados_anteriores JSONB,
  dados_novos JSONB,
  
  -- Timestamp
  criado_em TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  
  INDEX(usuario_id, criado_em),
  INDEX(recurso, criado_em),
  INDEX(criado_em)
);
```

### 4.7 Tabela: integracao_config

Configurações de integração de cada site.

```sql
CREATE TABLE integracao_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL UNIQUE REFERENCES sites(id),
  
  -- Tipo de Integração
  tipo_integracao ENUM('health_check', 'webhook', 'sdk', 'manual') NOT NULL,
  
  -- Configuração
  config JSONB NOT NULL, -- Armazena config específica por tipo
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  ultimo_teste TIMESTAMP,
  teste_resultado ENUM('sucesso', 'falha', 'nao_testado'),
  
  -- Timestamp
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  
  INDEX(site_id),
  INDEX(tipo_integracao)
);
```

---

## 5. APIs e Endpoints

### 5.1 Endpoints tRPC para Gerenciamento de Sites

```typescript
// server/routers/sites.ts

export const sitesRouter = router({
  // Listar todos os sites
  list: publicProcedure
    .query(async ({ ctx }) => {
      return await db.query.sites.findMany({
        where: isNull(sites.deletado_em),
        orderBy: sites.nome
      });
    }),

  // Obter detalhes de um site
  get: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return await db.query.sites.findFirst({
        where: eq(sites.id, input.id)
      });
    }),

  // Criar novo site
  create: adminProcedure
    .input(z.object({
      nome: z.string(),
      url: z.string().url(),
      tipo: z.enum(['corretora', 'consorcio', 'seguros', 'holding', 'comunidade']),
      endpoint_health: z.string().url(),
      email_responsavel: z.string().email().optional()
    }))
    .mutation(async ({ input }) => {
      const [site] = await db.insert(sites).values(input).returning();
      return site;
    }),

  // Atualizar site
  update: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: z.object({
        nome: z.string().optional(),
        url: z.string().url().optional(),
        ativo: z.boolean().optional(),
        intervalo_verificacao: z.number().optional(),
        threshold_tempo_resposta: z.number().optional(),
        threshold_taxa_erro: z.number().optional()
      })
    }))
    .mutation(async ({ input }) => {
      const [site] = await db.update(sites)
        .set(input.data)
        .where(eq(sites.id, input.id))
        .returning();
      return site;
    }),

  // Deletar site (soft delete)
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.update(sites)
        .set({ deletado_em: new Date() })
        .where(eq(sites.id, input.id));
      return { success: true };
    }),

  // Testar conexão com site
  test: monitorProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const site = await db.query.sites.findFirst({
        where: eq(sites.id, input.id)
      });

      if (!site) throw new TRPCError({ code: 'NOT_FOUND' });

      try {
        const response = await fetch(site.endpoint_health, {
          timeout: site.timeout * 1000
        });
        const data = await response.json();

        return {
          sucesso: true,
          status: response.status,
          dados: data
        };
      } catch (error) {
        return {
          sucesso: false,
          erro: error.message
        };
      }
    })
});
```

### 5.2 Endpoints tRPC para Monitoramento

```typescript
// server/routers/monitoring.ts

export const monitoringRouter = router({
  // Obter status atual de todos os sites
  statusGeral: publicProcedure
    .query(async () => {
      const sites = await db.query.sites.findMany({
        where: isNull(sites.deletado_em)
      });

      const statuses = await Promise.all(
        sites.map(async (site) => {
          const lastCheck = await db.query.healthChecks.findFirst({
            where: eq(healthChecks.site_id, site.id),
            orderBy: desc(healthChecks.verificado_em),
            limit: 1
          });

          return {
            siteId: site.id,
            nome: site.nome,
            status: lastCheck?.status || 'unknown',
            tempoResposta: lastCheck?.tempo_resposta,
            taxaErro: lastCheck?.taxa_erro,
            verificadoEm: lastCheck?.verificado_em
          };
        })
      );

      return statuses;
    }),

  // Obter histórico de verificações de um site
  historico: publicProcedure
    .input(z.object({
      siteId: z.string().uuid(),
      horas: z.number().default(24)
    }))
    .query(async ({ input }) => {
      const dataInicio = new Date(Date.now() - input.horas * 60 * 60 * 1000);

      return await db.query.healthChecks.findMany({
        where: and(
          eq(healthChecks.site_id, input.siteId),
          gte(healthChecks.verificado_em, dataInicio)
        ),
        orderBy: desc(healthChecks.verificado_em),
        limit: 288 // 24h com verificações a cada 5 min
      });
    }),

  // Obter métricas agregadas
  metricas: publicProcedure
    .input(z.object({
      siteId: z.string().uuid(),
      periodo: z.enum(['24h', '7d', '30d']).default('24h')
    }))
    .query(async ({ input }) => {
      const horas = {
        '24h': 24,
        '7d': 24 * 7,
        '30d': 24 * 30
      }[input.periodo];

      const dataInicio = new Date(Date.now() - horas * 60 * 60 * 1000);

      const checks = await db.query.healthChecks.findMany({
        where: and(
          eq(healthChecks.site_id, input.siteId),
          gte(healthChecks.verificado_em, dataInicio)
        )
      });

      const total = checks.length;
      const online = checks.filter(c => c.status === 'online').length;
      const uptime = (online / total) * 100;
      const tempoMedio = checks.reduce((sum, c) => sum + (c.tempo_resposta || 0), 0) / total;
      const taxaErroMedia = checks.reduce((sum, c) => sum + (c.taxa_erro || 0), 0) / total;

      return {
        uptime: uptime.toFixed(2),
        tempoMedio: tempoMedio.toFixed(0),
        taxaErroMedia: taxaErroMedia.toFixed(2),
        total,
        online,
        offline: total - online
      };
    })
});
```

### 5.3 Endpoints tRPC para Alertas

```typescript
// server/routers/alerts.ts

export const alertsRouter = router({
  // Listar alertas ativos
  ativos: publicProcedure
    .input(z.object({
      siteId: z.string().uuid().optional()
    }))
    .query(async ({ input }) => {
      const where = and(
        eq(alertas.resolvido, false),
        input.siteId ? eq(alertas.site_id, input.siteId) : undefined
      );

      return await db.query.alertas.findMany({
        where,
        orderBy: desc(alertas.criado_em)
      });
    }),

  // Resolver alerta
  resolver: monitorProcedure
    .input(z.object({
      id: z.string().uuid(),
      notas: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const [alerta] = await db.update(alertas)
        .set({
          resolvido: true,
          resolvido_em: new Date(),
          resolvido_por: ctx.user.id
        })
        .where(eq(alertas.id, input.id))
        .returning();

      // Registrar no audit log
      await db.insert(auditLog).values({
        usuario_id: ctx.user.id,
        acao: 'resolver_alerta',
        recurso: 'alertas',
        recurso_id: input.id,
        dados_novos: { resolvido: true, notas: input.notas }
      });

      return alerta;
    }),

  // Obter histórico de alertas
  historico: publicProcedure
    .input(z.object({
      siteId: z.string().uuid().optional(),
      limite: z.number().default(50)
    }))
    .query(async ({ input }) => {
      const where = input.siteId ? eq(alertas.site_id, input.siteId) : undefined;

      return await db.query.alertas.findMany({
        where,
        orderBy: desc(alertas.criado_em),
        limit: input.limite
      });
    })
});
```

---

## 6. Fluxo de Integração

### 6.1 Fluxo de Onboarding de um Site

```
┌─────────────────────────────────────────────────────────────────┐
│                    ONBOARDING DE NOVO SITE                      │
└─────────────────────────────────────────────────────────────────┘

1. PREPARAÇÃO NO SITE EXTERNO
   │
   ├─ Criar endpoint GET /api/health
   │  └─ Retorna status, uptime, métricas
   │
   ├─ Configurar webhook POST /webhooks (opcional)
   │  └─ Para eventos críticos
   │
   └─ Gerar API key (se necessário)
      └─ Para autenticação

2. REGISTRO NO PAINEL ADMINISTRATIVO
   │
   ├─ Admin acessa: /admin/sites/criar
   │
   ├─ Preenche formulário:
   │  ├─ Nome do site
   │  ├─ URL base
   │  ├─ Tipo (corretora, consórcio, etc)
   │  ├─ Endpoint de health check
   │  ├─ Email responsável
   │  └─ Thresholds de alerta
   │
   └─ Clica em "Criar Site"

3. TESTE DE CONEXÃO
   │
   ├─ Sistema faz requisição GET para /api/health
   │
   ├─ Se OK:
   │  ├─ Salva site no banco de dados
   │  ├─ Cria primeira verificação
   │  └─ Exibe mensagem de sucesso
   │
   └─ Se ERRO:
      ├─ Exibe erro específico
      ├─ Sugere correções
      └─ Permite tentar novamente

4. INICIAR MONITORAMENTO
   │
   ├─ Scheduler começa verificações a cada 5 min
   │
   ├─ Armazena dados em health_checks
   │
   ├─ Se problema detectado:
   │  ├─ Cria alerta
   │  ├─ Envia notificações
   │  └─ Atualiza dashboard
   │
   └─ Continua monitorando até resolução

5. DASHBOARD ATUALIZADO
   │
   └─ Site aparece em:
      ├─ Status Geral (com ícone 🟢)
      ├─ Tabela de Sites
      ├─ Gráficos de Uptime
      └─ Relatórios
```

### 6.2 Fluxo de Detecção de Instabilidade

```
┌─────────────────────────────────────────────────────────────────┐
│                 DETECÇÃO DE INSTABILIDADE                        │
└─────────────────────────────────────────────────────────────────┘

A CADA 5 MINUTOS (configurável)
│
▼
┌──────────────────────────────────────────┐
│ Health Check Service                     │
│ • Faz GET /api/health para cada site    │
│ • Mede tempo de resposta                 │
│ • Verifica código HTTP                   │
└──────────────────────────────────────────┘
│
▼
┌──────────────────────────────────────────┐
│ Armazenar Resultado                      │
│ • Insere em health_checks table          │
│ • Atualiza status do site                │
│ • Calcula uptime                         │
└──────────────────────────────────────────┘
│
▼
┌──────────────────────────────────────────┐
│ Alert Engine                             │
│ • Verifica se status mudou               │
│ • Verifica thresholds                    │
│ • Cria alerta se necessário              │
└──────────────────────────────────────────┘
│
├─ 🔴 CRÍTICA → RED FLAG IMEDIATA
│  │
│  ▼
│  ┌──────────────────────────────────────┐
│  │ Notification Service                 │
│  │ • Email (RED FLAG)                   │
│  │ • WhatsApp                           │
│  │ • SMS                                │
│  │ • Push Notification                  │
│  └──────────────────────────────────────┘
│
├─ 🟠 ALTA → RED FLAG COM DELAY (5 min)
│  │
│  ▼
│  ┌──────────────────────────────────────┐
│  │ Aguardar Confirmação                 │
│  │ • Próxima verificação em 5 min       │
│  │ • Se persiste → Enviar RED FLAG      │
│  │ • Se resolveu → Cancelar alerta      │
│  └──────────────────────────────────────┘
│
└─ 🟡 MÉDIA → Alerta sem RED FLAG
   │
   ▼
   ┌──────────────────────────────────────┐
   │ Push Notification Apenas             │
   │ • Sem email                          │
   │ • Sem WhatsApp/SMS                   │
   └──────────────────────────────────────┘

▼
┌──────────────────────────────────────────┐
│ WebSocket Broadcast                      │
│ • Atualiza dashboard em tempo real       │
│ • Notifica usuários conectados           │
│ • Exibe alerta visual                    │
└──────────────────────────────────────────┘
```

---

## 7. Roadmap de Implementação

### 7.1 Timeline de 12 Semanas

#### **Fase 1: Planejamento e Setup (Semanas 1-2)**

**Semana 1:**
- ✅ Finalizar arquitetura técnica
- ✅ Configurar repositório Git
- ✅ Setup do banco de dados PostgreSQL
- ✅ Configurar Redis para cache
- ✅ Setup do ambiente de desenvolvimento

**Semana 2:**
- ✅ Criar migrations do banco de dados
- ✅ Setup de autenticação OAuth
- ✅ Configurar SendGrid para emails
- ✅ Setup de WebSocket com Socket.io
- ✅ Documentar APIs

**Entregáveis:**
- Repositório Git configurado
- Banco de dados criado
- Documentação de APIs
- Ambiente de desenvolvimento funcional

---

#### **Fase 2: Backend - Core (Semanas 3-4)**

**Semana 3:**
- ✅ Implementar tRPC routers para sites
- ✅ Implementar tRPC routers para monitoramento
- ✅ Criar Health Check Service
- ✅ Implementar database queries

**Semana 4:**
- ✅ Implementar Alert Engine
- ✅ Implementar Notification Service (Email)
- ✅ Implementar WebSocket Server
- ✅ Criar tRPC routers para alertas
- ✅ Implementar RBAC (Role-Based Access Control)

**Entregáveis:**
- APIs tRPC funcionais
- Health Check Service operacional
- Alert Engine testado
- Notificações por email funcionando

---

#### **Fase 3: Frontend - Dashboard (Semanas 5-6)**

**Semana 5:**
- ✅ Criar layout do painel administrativo
- ✅ Implementar Dashboard Principal
- ✅ Criar componentes de Status
- ✅ Implementar gráficos de uptime

**Semana 6:**
- ✅ Criar página de Gerenciamento de Sites
- ✅ Implementar formulário de criar/editar site
- ✅ Criar página de Alertas
- ✅ Implementar página de Relatórios
- ✅ Adicionar autenticação ao frontend

**Entregáveis:**
- Dashboard funcional
- Páginas de gerenciamento
- Gráficos e visualizações
- Autenticação integrada

---

#### **Fase 4: Integração com Sites (Semanas 7-8)**

**Semana 7:**
- ✅ Integrar Movimento Mais Brasil (Site 1)
- ✅ Integrar Movimento Mais Seguro (Site 2)
- ✅ Integrar Mais Brasil Motorcycle (Site 3)
- ✅ Testar health checks
- ✅ Validar alertas

**Semana 8:**
- ✅ Integrar Potere BP Mensal (Site 4)
- ✅ Integrar Potere Consórcio (Site 5)
- ✅ Integrar Soluções Corretora (Site 6)
- ✅ Integrar Alpha Proteções (Site 7)
- ✅ Integrar Grupo MMB (Site 8)
- ✅ Integrar Juntos Podemos Mais (Site 9)

**Entregáveis:**
- 9 sites integrados
- Health checks funcionando
- Alertas sendo gerados
- Dashboard mostrando todos os sites

---

#### **Fase 5: Testes e Otimização (Semanas 9-10)**

**Semana 9:**
- ✅ Testes de carga
- ✅ Testes de segurança
- ✅ Testes de performance
- ✅ Testes de integração
- ✅ Testes de alertas

**Semana 10:**
- ✅ Otimizar queries do banco de dados
- ✅ Otimizar frontend (lazy loading, etc)
- ✅ Implementar caching
- ✅ Melhorar tempo de resposta
- ✅ Corrigir bugs encontrados

**Entregáveis:**
- Testes completos
- Performance otimizada
- Bugs corrigidos
- Documentação atualizada

---

#### **Fase 6: Deploy e Treinamento (Semanas 11-12)**

**Semana 11:**
- ✅ Deploy em staging
- ✅ Testes finais em staging
- ✅ Preparar documentação para usuários
- ✅ Criar guias de uso
- ✅ Preparar treinamento

**Semana 12:**
- ✅ Deploy em produção
- ✅ Monitorar estabilidade
- ✅ Treinar usuários
- ✅ Suporte inicial
- ✅ Documentação final

**Entregáveis:**
- Sistema em produção
- Documentação completa
- Usuários treinados
- Suporte operacional

---

### 7.2 Cronograma Detalhado

| Semana | Fase | Atividades | Status |
|--------|------|-----------|--------|
| 1-2 | Setup | Arquitetura, DB, Auth | ⏳ Planejado |
| 3-4 | Backend | APIs, Health Check, Alerts | ⏳ Planejado |
| 5-6 | Frontend | Dashboard, Gerenciamento | ⏳ Planejado |
| 7-8 | Integração | 9 sites integrados | ⏳ Planejado |
| 9-10 | Testes | Testes e otimização | ⏳ Planejado |
| 11-12 | Deploy | Produção e treinamento | ⏳ Planejado |

---

## 8. Checklist de Integração

### 8.1 Por Site

#### Site 1: Movimento Mais Brasil

```
[ ] Preparação
    [ ] Contatar responsável do site
    [ ] Documentar endpoints existentes
    [ ] Criar endpoint /api/health
    [ ] Testar endpoint localmente

[ ] Configuração no Painel
    [ ] Registrar site no painel
    [ ] Configurar thresholds de alerta
    [ ] Testar conexão
    [ ] Validar dados de health check

[ ] Monitoramento
    [ ] Verificar health checks a cada 5 min
    [ ] Validar alertas funcionando
    [ ] Testar notificações por email
    [ ] Testar notificações por WhatsApp

[ ] Validação
    [ ] Simular instabilidade
    [ ] Verificar alerta gerado
    [ ] Verificar email enviado
    [ ] Verificar dashboard atualizado
    [ ] Documentar resultado
```

#### Site 2: Movimento Mais Seguro
```
[ ] [Repetir checklist do Site 1]
```

#### Site 3: Mais Brasil Motorcycle
```
[ ] [Repetir checklist do Site 1]
```

#### Site 4: Potere BP Mensal
```
[ ] [Repetir checklist do Site 1]
```

#### Site 5: Potere Consórcio
```
[ ] [Repetir checklist do Site 1]
```

#### Site 6: Soluções Corretora
```
[ ] [Repetir checklist do Site 1]
```

#### Site 7: Alpha Proteções
```
[ ] [Repetir checklist do Site 1]
```

#### Site 8: Grupo MMB
```
[ ] [Repetir checklist do Site 1]
```

#### Site 9: Juntos Podemos Mais
```
[ ] [Repetir checklist do Site 1]
```

### 8.2 Checklist Geral do Projeto

```
[ ] INFRAESTRUTURA
    [ ] PostgreSQL configurado
    [ ] Redis configurado
    [ ] Vercel configurado
    [ ] Domínio SSL configurado
    [ ] CDN configurado

[ ] BACKEND
    [ ] tRPC routers implementados
    [ ] Health Check Service funcionando
    [ ] Alert Engine funcionando
    [ ] Notification Service funcionando
    [ ] WebSocket Server funcionando
    [ ] RBAC implementado
    [ ] Rate limiting implementado
    [ ] Logging implementado

[ ] FRONTEND
    [ ] Dashboard implementado
    [ ] Gerenciamento de Sites
    [ ] Página de Alertas
    [ ] Página de Relatórios
    [ ] Página de Usuários
    [ ] Página de Configurações
    [ ] Autenticação OAuth
    [ ] Responsividade testada

[ ] SEGURANÇA
    [ ] HTTPS em todos os endpoints
    [ ] CORS configurado
    [ ] CSRF protection
    [ ] SQL injection prevention
    [ ] XSS prevention
    [ ] Rate limiting
    [ ] Audit logging
    [ ] Criptografia de dados sensíveis

[ ] TESTES
    [ ] Testes unitários
    [ ] Testes de integração
    [ ] Testes de carga
    [ ] Testes de segurança
    [ ] Testes de performance
    [ ] Testes de alertas
    [ ] Testes de notificações

[ ] DOCUMENTAÇÃO
    [ ] README.md
    [ ] API documentation
    [ ] Guia de usuário
    [ ] Guia de administrador
    [ ] Guia de troubleshooting
    [ ] Changelog

[ ] DEPLOY
    [ ] Staging deployment
    [ ] Production deployment
    [ ] Backup strategy
    [ ] Disaster recovery plan
    [ ] Monitoring em produção
    [ ] Alertas de produção

[ ] TREINAMENTO
    [ ] Documentação para usuários
    [ ] Vídeos de tutorial
    [ ] Sessão de treinamento
    [ ] Suporte inicial
```

---

## 9. Segurança e Compliance

### 9.1 Autenticação e Autorização

**OAuth 2.0 + JWT:**
- Integração com Manus OAuth
- Token JWT com expiração (1 hora)
- Refresh token (7 dias)
- RBAC com 3 roles: admin, monitor, viewer

**Permissões por Role:**

| Ação | Admin | Monitor | Viewer |
|------|-------|---------|--------|
| Visualizar Dashboard | ✅ | ✅ | ✅ |
| Criar Site | ✅ | ❌ | ❌ |
| Editar Site | ✅ | ❌ | ❌ |
| Deletar Site | ✅ | ❌ | ❌ |
| Visualizar Alertas | ✅ | ✅ | ✅ |
| Resolver Alertas | ✅ | ✅ | ❌ |
| Criar Usuários | ✅ | ❌ | ❌ |
| Editar Configurações | ✅ | ❌ | ❌ |
| Visualizar Relatórios | ✅ | ✅ | ✅ |
| Exportar Relatórios | ✅ | ✅ | ❌ |

### 9.2 Proteção de Dados

**Criptografia:**
- HTTPS obrigatório em todos os endpoints
- Dados sensíveis (API keys) criptografados no banco
- Senhas hasheadas com bcrypt

**Backup:**
- Backup diário do banco de dados
- Retenção de 30 dias
- Testes de restore mensais

### 9.3 Auditoria

**Audit Log:**
- Registra todas as ações de usuários
- Inclui: usuário, ação, recurso, timestamp, IP
- Retenção de 1 ano
- Relatórios de auditoria

### 9.4 Conformidade

**LGPD:**
- Consentimento para coleta de dados
- Direito ao esquecimento
- Portabilidade de dados
- Notificação de incidentes

**GDPR (se aplicável):**
- Data Processing Agreement
- Privacy by Design
- Data Minimization
- Purpose Limitation

---

## 10. Testes e Validação

### 10.1 Estratégia de Testes

**Testes Unitários:**
- Funções de cálculo de uptime
- Validação de thresholds
- Formatação de mensagens de alerta

**Testes de Integração:**
- Fluxo completo de health check
- Criação de alertas
- Envio de notificações
- Atualização de dashboard

**Testes de Carga:**
- 1000 requisições/segundo
- Monitoramento de 9 sites
- 100 usuários simultâneos

**Testes de Segurança:**
- Injeção SQL
- XSS
- CSRF
- Autenticação e autorização

### 10.2 Critérios de Aceitação

| Critério | Métrica | Target |
|----------|---------|--------|
| Uptime do Painel | % | 99.9% |
| Tempo de Resposta | ms | < 200ms |
| Latência de Alerta | segundos | < 30s |
| Taxa de Erro | % | < 0.1% |
| Cobertura de Testes | % | > 80% |
| Performance | Requests/s | > 1000 |

### 10.3 Teste de Instabilidade Simulada

**Cenário 1: Site Offline**
```
1. Parar o servidor do site
2. Aguardar próxima verificação (5 min)
3. Verificar se alerta foi criado
4. Verificar se email foi enviado
5. Verificar se dashboard foi atualizado
6. Reiniciar o servidor
7. Verificar se alerta foi resolvido
8. Verificar se email de recuperação foi enviado
```

**Cenário 2: Tempo de Resposta Alto**
```
1. Simular latência no site (5-10s)
2. Aguardar próxima verificação
3. Verificar se alerta foi criado (após 5 min)
4. Remover latência
5. Verificar se alerta foi resolvido
```

**Cenário 3: Taxa de Erro Alta**
```
1. Fazer endpoint retornar 500 para 10% das requisições
2. Aguardar próxima verificação
3. Verificar se alerta foi criado (após 5 min)
4. Corrigir endpoint
5. Verificar se alerta foi resolvido
```

---

## Resumo Executivo

### Arquitetura Proposta

A solução propõe um painel administrativo centralizado em **administradoramutual.com.br/admin/** que consolida o monitoramento de 9 sites através de:

1. **Health Check Service** - Verifica status de cada site a cada 5 minutos
2. **Alert Engine** - Classifica instabilidades e cria alertas
3. **Notification Service** - Envia alertas por email, WhatsApp, SMS e push
4. **Dashboard em Tempo Real** - Visualização de status de todos os sites
5. **Relatórios Consolidados** - Análise de uptime e performance

### Localização no Site

**URL:** `https://www.administradoramutual.com.br/admin/`

**Menu:** Painel Admin (ícone 🔧) no menu principal

**Estrutura:**
- Dashboard (status geral)
- Gerenciamento de Sites
- Monitoramento em Tempo Real
- Alertas
- Relatórios
- Usuários
- Configurações

### Timeline

**12 semanas** para implementação completa:
- Semanas 1-2: Setup e planejamento
- Semanas 3-4: Backend core
- Semanas 5-6: Frontend dashboard
- Semanas 7-8: Integração dos 9 sites
- Semanas 9-10: Testes e otimização
- Semanas 11-12: Deploy e treinamento

### Próximos Passos

1. ✅ Aprovação desta arquitetura
2. ⏳ Iniciar Fase 1 (Setup)
3. ⏳ Configurar repositório Git
4. ⏳ Criar banco de dados
5. ⏳ Iniciar desenvolvimento backend

---

**Versão:** 2.0
**Data:** 15 de Dezembro de 2025
**Status:** Pronto para Implementação
**Autor:** Manus AI
