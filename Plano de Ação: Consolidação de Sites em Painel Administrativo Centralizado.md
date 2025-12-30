# Plano de Ação: Consolidação de Sites em Painel Administrativo Centralizado

## 1. Visão Geral do Projeto

### Objetivo
Consolidar 8 sites independentes em um painel administrativo centralizado dentro de **administradoramutual.com.br** para:
- ✅ Gerenciar funcionalidades de todos os sites
- ✅ Monitorar instabilidades em tempo real
- ✅ Centralizar controle operacional
- ✅ Facilitar manutenção e atualizações

### Sites a Consolidar
1. **Movimento Mais Brasil** - https://www.movimentomaisbrasil.org.br/
2. **Movimento Mais Seguro** - https://www.movimentomaisseguro.com.br/
3. **Mais Brasil Motorcycle** - https://www.maisbrasilmotorcycle.com.br/
4. **Potere BP Mensal** - https://www.poterebpmensal.com.br/
5. **Potere Consórcio** - https://www.potereconsorcio.com.br/
6. **Soluções Corretora** - https://www.solucoescorretora.com.br/
7. **Alpha Proteções** - https://www.alphaprotecoes.com.br/
8. **Grupo MMB** - https://www.grupommb.com/
9. **Juntos Podemos Mais** - https://www.juntospodmais.com.br/

---

## 2. Arquitetura Proposta

### 2.1 Estrutura Geral

```
administradoramutual.com.br/
├── / (Página Principal)
├── /admin/ (Painel Administrativo)
│   ├── /dashboard (Dashboard Principal)
│   ├── /sites (Gerenciamento de Sites)
│   ├── /monitoramento (Monitoramento em Tempo Real)
│   ├── /alertas (Sistema de Alertas)
│   ├── /relatorios (Relatórios e Analytics)
│   ├── /usuarios (Gestão de Usuários)
│   └── /configuracoes (Configurações)
├── /gestao-segura/ (Já existente)
└── /processos-lista.html (Já existente)
```

### 2.2 Arquitetura Técnica

#### Backend (Node.js/Express + tRPC)
```
Servidor Central
├── API de Monitoramento (Health Checks)
├── Sistema de Alertas
├── Banco de Dados Centralizado
├── Autenticação e Autorização
└── Webhooks para Sites Externos
```

#### Integração com Sites Externos
- **Health Check API:** Cada site expõe um endpoint `/api/health` que retorna status
- **Webhooks:** Sites enviam eventos críticos para o servidor central
- **SDK Integrado:** Pequeno script JS injetado em cada site para monitoramento
- **Sincronização:** Dados sincronizados a cada 5 minutos (configurável)

---

## 3. Localização no Site

### 3.1 Navegação Principal

**Opção A: Menu Superior (Recomendado)**
```
administradoramutual.com.br
├── Home
├── Produtos
├── Sobre
├── Painel Admin ← NOVO (ícone de engrenagem)
└── Contato
```

**Opção B: Submenu Dedicado**
```
administradoramutual.com.br
├── Admin
│   ├── Dashboard
│   ├── Gerenciar Sites
│   ├── Monitoramento
│   └── Relatórios
```

### 3.2 Localização Recomendada: `/admin/`

- **URL Base:** `https://www.administradoramutual.com.br/admin/`
- **Acesso:** Apenas para usuários autenticados com role `admin`
- **Proteção:** OAuth + JWT + Rate Limiting
- **Responsividade:** Desktop-first (pode ser acessado em mobile)

---

## 4. Estrutura do Painel Administrativo

### 4.1 Dashboard Principal (`/admin/dashboard`)

**Componentes:**
- **Status Geral:** Cards mostrando status de cada site (Online/Offline/Degradado) - 9 sites
- **Gráfico de Uptime:** Últimas 24h, 7 dias, 30 dias
- **Alertas Recentes:** Últimos 10 alertas com timestamp
- **Métricas Rápidas:** Tempo de resposta médio, Taxa de erro, Requisições/min
- **Timeline:** Histórico de eventos dos últimos 7 dias

### 4.2 Gerenciamento de Sites (`/admin/sites`)

**Tabela com Colunas:**
| Site | Status | Uptime | Tempo Resposta | Última Verificação | Ações |
|------|--------|--------|----------------|-------------------|-------|
| Movimento Mais Brasil | 🟢 Online | 99.8% | 245ms | 2 min atrás | Editar, Pausar, Logs |
| Movimento Mais Seguro | 🟢 Online | 99.5% | 312ms | 1 min atrás | Editar, Pausar, Logs |
| Mais Brasil Motorcycle | 🟢 Online | 99.2% | 289ms | 3 min atrás | Editar, Pausar, Logs |
| Potere BP Mensal | 🟢 Online | 99.7% | 267ms | 2 min atrás | Editar, Pausar, Logs |
| Potere Consórcio | 🟢 Online | 99.6% | 298ms | 1 min atrás | Editar, Pausar, Logs |
| Soluções Corretora | 🟢 Online | 99.4% | 321ms | 3 min atrás | Editar, Pausar, Logs |
| Alpha Proteções | 🟡 Degradado | 98.9% | 4.2s | 2 min atrás | Editar, Pausar, Logs |
| Grupo MMB | 🟢 Online | 99.9% | 234ms | 1 min atrás | Editar, Pausar, Logs |
| Juntos Podemos Mais | 🟢 Online | 99.3% | 276ms | 2 min atrás | Editar, Pausar, Logs |

**Funcionalidades por Site:**
- ✅ Editar configurações de monitoramento
- ✅ Pausar/Retomar monitoramento
- ✅ Visualizar logs detalhados
- ✅ Configurar alertas personalizados
- ✅ Testar conectividade
- ✅ Histórico de incidentes

### 4.3 Monitoramento em Tempo Real (`/admin/monitoramento`)

**Visualizações:**
- **Gráfico de Uptime:** Linha temporal com status de cada site
- **Mapa de Calor:** Status por hora do dia
- **Detalhes de Resposta:** Tempo de resposta, Taxa de erro, Throughput
- **Logs em Tempo Real:** Stream de eventos (WebSocket)
- **Comparação:** Comparar performance entre sites

### 4.4 Sistema de Alertas (`/admin/alertas`)

**Tipos de Alertas:**
1. **Site Offline:** Quando site fica indisponível por > 5 min
2. **Tempo de Resposta Alto:** Quando tempo > 5s
3. **Taxa de Erro Elevada:** Quando erro rate > 5%
4. **Certificado SSL Expirando:** Com 30 dias de antecedência
5. **Quota de Requisições:** Quando atinge 80% do limite
6. **Falha de Integração:** Quando API externa falha

**Canais de Notificação:**
- 📧 Email
- 💬 WhatsApp
- 🔔 Push Notification (no painel)
- 📱 SMS (opcional)
- 🪝 Webhook customizado

### 4.5 Relatórios (`/admin/relatorios`)

**Relatórios Disponíveis:**
- **Uptime Mensal:** Por site, com SLA
- **Performance:** Tempo de resposta, latência, throughput
- **Incidentes:** Resumo de downtime, causa raiz, duração
- **Custos:** Custo por site, por serviço
- **Comparativo:** Performance entre sites
- **Exportar:** PDF, CSV, JSON

### 4.6 Gestão de Usuários (`/admin/usuarios`)

**Funcionalidades:**
- Criar/Editar/Deletar usuários
- Atribuir roles (admin, monitor, viewer)
- Controlar acesso por site
- Histórico de ações (audit log)
- Ativar/Desativar usuários

### 4.7 Configurações (`/admin/configuracoes`)

**Opções:**
- Intervalo de verificação (padrão: 5 min)
- Threshold de alertas (tempo resposta, taxa erro)
- Retenção de logs (padrão: 90 dias)
- Configuração de notificações
- Integração com ferramentas externas (Slack, PagerDuty)
- Backup e restore

---

## 5. Implementação Técnica

### 5.1 Fase 1: Infraestrutura Base (2-3 semanas)

**Tarefas:**
1. ✅ Criar estrutura de banco de dados
   - Tabela `sites` (nome, URL, status, config)
   - Tabela `health_checks` (timestamp, status, tempo resposta)
   - Tabela `alertas` (tipo, site, timestamp, resolvido)
   - Tabela `usuarios` (email, role, permissões)

2. ✅ Implementar API de Health Check
   - Endpoint `/api/health/:site_id`
   - Verificação a cada 5 minutos
   - Armazenar histórico

3. ✅ Criar autenticação
   - OAuth para login
   - JWT para sessão
   - Role-based access control (RBAC)

4. ✅ Configurar WebSocket para tempo real

### 5.2 Fase 2: Painel Administrativo (3-4 semanas)

**Tarefas:**
1. ✅ Dashboard principal
2. ✅ Gerenciamento de sites
3. ✅ Monitoramento em tempo real
4. ✅ Sistema de alertas
5. ✅ Relatórios básicos

### 5.3 Fase 3: Integração com Sites (2-3 semanas)

**Tarefas:**
1. ✅ Criar SDK de monitoramento (JS)
2. ✅ Injetar script em cada site
3. ✅ Configurar webhooks
4. ✅ Testar integração

### 5.4 Fase 4: Refinamento e Deploy (1-2 semanas)

**Tarefas:**
1. ✅ Testes de carga
2. ✅ Documentação
3. ✅ Treinamento de usuários
4. ✅ Deploy em produção

---

## 6. Modelo de Dados

### 6.1 Tabela `sites`

```sql
CREATE TABLE sites (
  id UUID PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL UNIQUE,
  descricao TEXT,
  status ENUM('online', 'offline', 'degradado', 'pausado'),
  intervalo_verificacao INT DEFAULT 300, -- 5 minutos
  timeout INT DEFAULT 10, -- segundos
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);
```

### 6.2 Tabela `health_checks`

```sql
CREATE TABLE health_checks (
  id UUID PRIMARY KEY,
  site_id UUID REFERENCES sites(id),
  status ENUM('online', 'offline', 'timeout', 'erro'),
  tempo_resposta INT, -- ms
  codigo_http INT,
  mensagem_erro TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  INDEX(site_id, timestamp)
);
```

### 6.3 Tabela `alertas`

```sql
CREATE TABLE alertas (
  id UUID PRIMARY KEY,
  site_id UUID REFERENCES sites(id),
  tipo ENUM('offline', 'tempo_alto', 'erro_alto', 'ssl', 'quota'),
  severidade ENUM('baixa', 'media', 'alta', 'critica'),
  mensagem TEXT NOT NULL,
  resolvido BOOLEAN DEFAULT false,
  criado_em TIMESTAMP DEFAULT NOW(),
  resolvido_em TIMESTAMP,
  INDEX(site_id, criado_em)
);
```

### 6.4 Tabela `notificacoes`

```sql
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY,
  alerta_id UUID REFERENCES alertas(id),
  canal ENUM('email', 'whatsapp', 'sms', 'push', 'webhook'),
  destinatario VARCHAR(255),
  enviado BOOLEAN DEFAULT false,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 7. API Endpoints

### 7.1 Health Check API

```
GET /api/health/:site_id
Response: {
  "status": "online",
  "tempo_resposta": 245,
  "codigo_http": 200,
  "timestamp": "2025-12-15T20:30:00Z",
  "uptime_24h": 99.8
}
```

### 7.2 Alertas API

```
GET /api/alertas?site_id=...&limite=10
POST /api/alertas/:id/resolver
GET /api/alertas/stats
```

### 7.3 Relatórios API

```
GET /api/relatorios/uptime?site_id=...&periodo=30d
GET /api/relatorios/performance?site_id=...
GET /api/relatorios/incidentes?site_id=...
```

---

## 8. Interface de Monitoramento

### 8.1 Dashboard Visual

```
┌─────────────────────────────────────────────────────────────┐
│  PAINEL ADMINISTRATIVO - MONITORAMENTO DE SITES             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Status Geral                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ 🟢 Online    │ │ 🟡 Degradado │ │ 🔴 Offline   │       │
│  │ 8 sites      │ │ 1 site       │ │ 0 sites      │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                             │
│  Gráfico de Uptime (últimas 24h)                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 100% ┤                                               │   │
│  │      │  ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁                   │   │
│  │  99% ┤ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄                   │   │
│  │      └─────────────────────────────────────────────┘   │
│  │      00:00  06:00  12:00  18:00  23:59                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Alertas Recentes                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔴 Movimento Mais Brasil - OFFLINE (há 15 min)     │   │
│  │ 🟡 Alpha Proteções - Tempo alto (5.2s)             │   │
│  │ ✅ Grupo MMB - Recuperado (há 2 min)               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Tabela de Sites                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Site │ Status │ Uptime │ Tempo │ Última Check    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ MMB  │ 🟢    │ 99.8%  │ 245ms │ 2 min atrás     │   │
│  │ MMS  │ 🟢    │ 99.5%  │ 312ms │ 1 min atrás     │   │
│  │ MBM  │ 🟢    │ 99.2%  │ 289ms │ 3 min atrás     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Segurança

### 9.1 Autenticação
- ✅ OAuth 2.0 (Manus)
- ✅ JWT para sessão
- ✅ Refresh token automático
- ✅ Logout em caso de inatividade (15 min)

### 9.2 Autorização
- ✅ Role-based access control (RBAC)
- ✅ Permissões granulares por site
- ✅ Audit log de todas as ações

### 9.3 Proteção de Dados
- ✅ HTTPS obrigatório
- ✅ Rate limiting (100 req/min por IP)
- ✅ CORS configurado
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ XSS protection (React + sanitization)

---

## 10. Roadmap de Implementação

### Semana 1-2: Planejamento e Setup
- [ ] Definir arquitetura final
- [ ] Criar repositório
- [ ] Setup do banco de dados
- [ ] Configurar CI/CD

### Semana 3-4: Backend
- [ ] API de health check
- [ ] Sistema de alertas
- [ ] Autenticação
- [ ] WebSocket para tempo real

### Semana 5-6: Frontend
- [ ] Dashboard principal
- [ ] Gerenciamento de sites
- [ ] Monitoramento em tempo real
- [ ] Sistema de alertas

### Semana 7-8: Integração
- [ ] SDK de monitoramento
- [ ] Injetar em cada site
- [ ] Configurar webhooks
- [ ] Testes

### Semana 9: Deploy
- [ ] Testes de carga
- [ ] Documentação
- [ ] Treinamento
- [ ] Go-live

---

## 11. Benefícios

✅ **Centralização:** Gerenciar tudo em um único lugar
✅ **Visibilidade:** Ver status de todos os sites em tempo real
✅ **Alertas:** Notificações imediatas de problemas
✅ **Relatórios:** Análise de performance e uptime
✅ **Escalabilidade:** Fácil adicionar novos sites
✅ **Segurança:** Controle de acesso centralizado
✅ **Eficiência:** Reduzir tempo de resposta a incidentes

---

## 12. Próximos Passos

1. **Aprovação do Plano:** Validar com stakeholders
2. **Detalhamento Técnico:** Criar especificações detalhadas
3. **Prototipagem:** Criar mockups do painel
4. **Desenvolvimento:** Iniciar implementação
5. **Testes:** QA e testes de carga
6. **Deploy:** Lançamento em produção

---

**Versão:** 1.0
**Data:** 15 de Dezembro de 2025
**Status:** Proposta para Aprovação
