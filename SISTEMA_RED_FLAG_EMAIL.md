# Sistema de Red Flag por Email - Especificação Técnica

## 1. Visão Geral

Quando uma **instabilidade** for detectada em qualquer um dos 9 sites monitorados, o sistema deve:

1. ✅ Registrar a instabilidade no banco de dados
2. ✅ Criar um alerta no painel administrativo
3. ✅ **Enviar um email com RED FLAG para alessandro@pizzolatto.com**
4. ✅ Notificar via outros canais (WhatsApp, SMS, Push)
5. ✅ Atualizar dashboard em tempo real

---

## 2. Tipos de Instabilidades que Acionam Red Flag

### 2.1 Instabilidades Críticas (RED FLAG Imediata)

| Tipo | Severidade | Ação |
|------|-----------|------|
| **Site Offline** | 🔴 CRÍTICA | Email + WhatsApp + SMS |
| **Tempo de Resposta > 10s** | 🔴 CRÍTICA | Email + WhatsApp + Push |
| **Taxa de Erro > 10%** | 🔴 CRÍTICA | Email + WhatsApp + Push |
| **Certificado SSL Expirado** | 🔴 CRÍTICA | Email + Push |
| **Banco de Dados Desconectado** | 🔴 CRÍTICA | Email + WhatsApp + SMS |

### 2.2 Instabilidades Altas (RED FLAG com Delay)

| Tipo | Severidade | Ação | Delay |
|------|-----------|------|-------|
| **Tempo de Resposta 5-10s** | 🟠 ALTA | Email + Push | 5 min |
| **Taxa de Erro 5-10%** | 🟠 ALTA | Email + Push | 5 min |
| **Cache Desconectado** | 🟠 ALTA | Email + Push | 10 min |
| **Quota de Requisições 80%** | 🟠 ALTA | Email + Push | 15 min |

### 2.3 Instabilidades Médias (Alerta sem RED FLAG)

| Tipo | Severidade | Ação |
|------|-----------|------|
| **Tempo de Resposta 2-5s** | 🟡 MÉDIA | Push apenas |
| **Taxa de Erro 1-5%** | 🟡 MÉDIA | Push apenas |
| **SSL Expirando em 7 dias** | 🟡 MÉDIA | Email (sem RED FLAG) |

---

## 3. Estrutura do Email com RED FLAG

### 3.1 Template de Email - Instabilidade Crítica

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  🚨 RED FLAG - INSTABILIDADE CRÍTICA DETECTADA 🚨              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SITE: Movimento Mais Brasil                                   │
│  URL: https://www.movimentomaisbrasil.org.br/                  │
│  STATUS: 🔴 OFFLINE                                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  DETALHES DO INCIDENTE                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Tipo de Problema:     Site Offline                            │
│  Severidade:           🔴 CRÍTICA                               │
│  Detectado em:         15/12/2025 às 20:45:30 UTC             │
│  Duração:              15 minutos                               │
│  Última Resposta:      15/12/2025 às 20:30:15 UTC             │
│  Código HTTP:          Connection Timeout                      │
│  Tempo de Resposta:    > 30s (timeout)                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  HISTÓRICO RECENTE                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  20:30:15 - ✅ Online (245ms)                                  │
│  20:35:20 - ⚠️ Tempo Alto (8.5s)                               │
│  20:40:10 - 🔴 Offline (timeout)                               │
│  20:45:30 - 🔴 Offline (timeout) ← ALERTA ACIONADO             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  AÇÕES RECOMENDADAS                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  1. Acessar o painel administrativo para mais detalhes        │
│  2. Verificar logs do servidor                                 │
│  3. Contatar o time de suporte do site                         │
│  4. Monitorar recuperação em tempo real                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  LINKS RÁPIDOS                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📊 Acessar Dashboard:                                          │
│  https://www.administradoramutual.com.br/admin/dashboard       │
│                                                                 │
│  📋 Ver Detalhes do Site:                                       │
│  https://www.administradoramutual.com.br/admin/sites/mmb       │
│                                                                 │
│  🔍 Ver Logs Completos:                                         │
│  https://www.administradoramutual.com.br/admin/monitoramento   │
│                                                                 │
│  ⚠️ Resolver Alerta:                                            │
│  https://www.administradoramutual.com.br/admin/alertas/123     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  INFORMAÇÕES DO SISTEMA                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ID do Alerta:         ALT-20251215-001234                     │
│  ID do Incidente:      INC-20251215-005678                     │
│  Prioridade:           P1 - Crítica                             │
│  Notificações Enviadas: Email, WhatsApp, SMS                   │
│  Próxima Verificação:  15/12/2025 às 20:50:30 UTC             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Monitoramento Automático Ativo ✓                              │
│  Sistema continuará verificando a cada 5 minutos               │
│  Você será notificado quando o site se recuperar               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  © 2025 Administrador Mutual - Sistema de Monitoramento        │
│  Não responda este email. Acesse o painel para gerenciar.      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Template de Email - Instabilidade Alta (com Delay)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ⚠️ ALERTA - INSTABILIDADE DETECTADA ⚠️                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SITE: Alpha Proteções                                         │
│  URL: https://www.alphaprotecoes.com.br/                       │
│  STATUS: 🟡 DEGRADADO                                           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  DETALHES DO INCIDENTE                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Tipo de Problema:     Tempo de Resposta Alto                  │
│  Severidade:           🟠 ALTA                                  │
│  Detectado em:         15/12/2025 às 20:50:00 UTC             │
│  Duração:              5 minutos (persistente)                  │
│  Tempo de Resposta:    7.8s (limite: 5s)                       │
│  Taxa de Erro:         2.3%                                    │
│  Requisições/min:      245                                     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  HISTÓRICO RECENTE                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  20:40:00 - ✅ Online (312ms)                                  │
│  20:45:00 - ⚠️ Tempo Alto (6.2s)                               │
│  20:50:00 - ⚠️ Tempo Alto (7.8s) ← ALERTA ACIONADO             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  AÇÕES RECOMENDADAS                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  1. Verificar carga do servidor                                │
│  2. Analisar queries do banco de dados                         │
│  3. Verificar cache (Redis)                                    │
│  4. Monitorar se o problema persiste                           │
│                                                                 │
│  [Links e informações do sistema...]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Template de Email - Recuperação

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ✅ RECUPERADO - SITE VOLTOU AO NORMAL ✅                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SITE: Movimento Mais Brasil                                   │
│  URL: https://www.movimentomaisbrasil.org.br/                  │
│  STATUS: 🟢 ONLINE                                              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  RESUMO DO INCIDENTE                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Tipo de Problema:     Site Offline                            │
│  Detectado em:         15/12/2025 às 20:45:30 UTC             │
│  Recuperado em:        15/12/2025 às 21:05:45 UTC             │
│  Duração Total:        20 minutos e 15 segundos                │
│  Severidade:           🔴 CRÍTICA                               │
│  ID do Incidente:      INC-20251215-005678                     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  STATUS ATUAL                                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Tempo de Resposta:    245ms ✅                                 │
│  Taxa de Erro:         0% ✅                                    │
│  Uptime 24h:           99.8% ✅                                 │
│  Banco de Dados:       Conectado ✅                             │
│  Cache:                Conectado ✅                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  PRÓXIMAS ETAPAS                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  1. Investigar causa raiz do problema                          │
│  2. Revisar logs do servidor durante o período                │
│  3. Implementar medidas preventivas                            │
│  4. Documentar o incidente                                     │
│                                                                 │
│  [Links e informações do sistema...]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Fluxo de Acionamento da Red Flag

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO DE RED FLAG                             │
└─────────────────────────────────────────────────────────────────┘

1. Health Check Service (a cada 5 min)
   │
   ▼
2. Detecta Instabilidade?
   │
   ├─ NÃO → Continua monitorando
   │
   └─ SIM → Vai para próxima etapa
      │
      ▼
3. Classifica Severidade
   │
   ├─ 🔴 CRÍTICA → RED FLAG IMEDIATA
   │  │
   │  ▼
   │  Cria Alerta no BD
   │  │
   │  ▼
   │  Envia Email com RED FLAG para alessandro@pizzolatto.com
   │  │
   │  ▼
   │  Envia WhatsApp + SMS
   │  │
   │  ▼
   │  Atualiza Dashboard (WebSocket)
   │
   ├─ 🟠 ALTA → RED FLAG COM DELAY (5-15 min)
   │  │
   │  ▼
   │  Aguarda confirmação (problema persiste?)
   │  │
   │  ├─ SIM → Envia Email com RED FLAG
   │  │
   │  └─ NÃO → Cancela RED FLAG
   │
   └─ 🟡 MÉDIA → Alerta sem RED FLAG
      │
      ▼
      Envia Push Notification apenas
```

---

## 5. Configuração de Email

### 5.1 Serviço de Email

**Opção 1: Nodemailer + Gmail (Simples)**
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

**Opção 2: SendGrid (Recomendado para Produção)**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

**Opção 3: AWS SES (Enterprise)**
```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });
```

### 5.2 Variáveis de Ambiente

```env
# Email Configuration
EMAIL_SERVICE=sendgrid  # ou gmail, aws-ses
EMAIL_FROM=alerts@administradoramutual.com.br
EMAIL_TO_ADMIN=alessandro@pizzolatto.com

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Gmail
EMAIL_USER=alerts@administradoramutual.com.br
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx

# AWS SES
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

---

## 6. Código de Implementação

### 6.1 Função de Envio de Email

```typescript
// server/services/emailService.ts

import nodemailer from 'nodemailer';
import { AlertType, AlertSeverity } from '../types';

interface AlertEmailData {
  siteId: string;
  siteName: string;
  siteUrl: string;
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  detectedAt: Date;
  duration?: string;
  metrics?: {
    responseTime?: number;
    errorRate?: number;
    httpCode?: number;
  };
  history?: Array<{
    timestamp: Date;
    status: string;
    value: number;
  }>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendRedFlagAlert(data: AlertEmailData): Promise<void> {
    const isRedFlag = ['CRITICA'].includes(data.severity);
    const subject = isRedFlag 
      ? `🚨 RED FLAG - ${data.siteName} - ${data.alertType}`
      : `⚠️ ALERTA - ${data.siteName} - ${data.alertType}`;

    const htmlContent = this.generateEmailHTML(data, isRedFlag);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO_ADMIN,
      subject: subject,
      html: htmlContent,
      priority: isRedFlag ? 'high' : 'normal'
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email enviado para ${process.env.EMAIL_TO_ADMIN}`);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  }

  private generateEmailHTML(data: AlertEmailData, isRedFlag: boolean): string {
    const flagEmoji = isRedFlag ? '🚨' : '⚠️';
    const severityColor = {
      'CRITICA': '#d32f2f',
      'ALTA': '#f57c00',
      'MEDIA': '#fbc02d'
    }[data.severity] || '#666';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: ${severityColor}; color: white; padding: 20px; }
          .content { padding: 20px; background-color: #f5f5f5; }
          .section { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid ${severityColor}; }
          .metric { display: inline-block; margin-right: 20px; }
          .button { background-color: ${severityColor}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
          .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${flagEmoji} ${isRedFlag ? 'RED FLAG - INSTABILIDADE CRÍTICA' : 'ALERTA - INSTABILIDADE DETECTADA'}</h1>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>${data.siteName}</h2>
              <p><strong>URL:</strong> <a href="${data.siteUrl}">${data.siteUrl}</a></p>
              <p><strong>Tipo:</strong> ${data.alertType}</p>
              <p><strong>Severidade:</strong> ${data.severity}</p>
              <p><strong>Detectado em:</strong> ${data.detectedAt.toLocaleString('pt-BR')}</p>
              ${data.duration ? `<p><strong>Duração:</strong> ${data.duration}</p>` : ''}
            </div>

            <div class="section">
              <h3>Detalhes da Instabilidade</h3>
              <p>${data.message}</p>
              ${data.metrics ? `
                <div>
                  ${data.metrics.responseTime ? `<div class="metric"><strong>Tempo:</strong> ${data.metrics.responseTime}ms</div>` : ''}
                  ${data.metrics.errorRate ? `<div class="metric"><strong>Taxa Erro:</strong> ${data.metrics.errorRate}%</div>` : ''}
                  ${data.metrics.httpCode ? `<div class="metric"><strong>HTTP:</strong> ${data.metrics.httpCode}</div>` : ''}
                </div>
              ` : ''}
            </div>

            <div class="section">
              <h3>Ações Rápidas</h3>
              <p>
                <a href="https://www.administradoramutual.com.br/admin/dashboard" class="button">
                  Acessar Dashboard
                </a>
              </p>
              <p>
                <a href="https://www.administradoramutual.com.br/admin/sites/${data.siteId}" class="button">
                  Ver Detalhes do Site
                </a>
              </p>
            </div>
          </div>

          <div class="footer">
            <p>© 2025 Administrador Mutual - Sistema de Monitoramento</p>
            <p>Não responda este email. Acesse o painel para gerenciar.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendRecoveryEmail(data: AlertEmailData, duration: string): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #4caf50; color: white; padding: 20px; }
          .content { padding: 20px; background-color: #f5f5f5; }
          .section { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4caf50; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ RECUPERADO - SITE VOLTOU AO NORMAL</h1>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>${data.siteName}</h2>
              <p><strong>Status:</strong> 🟢 ONLINE</p>
              <p><strong>Duração do Incidente:</strong> ${duration}</p>
              <p>O site se recuperou e está funcionando normalmente.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO_ADMIN,
      subject: `✅ RECUPERADO - ${data.siteName}`,
      html: htmlContent,
      priority: 'normal'
    };

    await this.transporter.sendMail(mailOptions);
  }
}
```

### 6.2 Integração com Alert Engine

```typescript
// server/services/alertEngine.ts

import { EmailService } from './emailService';
import { NotificationService } from './notificationService';

export class AlertEngine {
  private emailService: EmailService;
  private notificationService: NotificationService;

  constructor() {
    this.emailService = new EmailService();
    this.notificationService = new NotificationService();
  }

  async handleInstability(
    siteId: string,
    siteName: string,
    siteUrl: string,
    alertType: AlertType,
    severity: AlertSeverity,
    metrics: any
  ): Promise<void> {
    // Criar alerta no banco de dados
    const alert = await db.insert(alerts).values({
      siteId,
      tipo: alertType,
      severidade: severity,
      mensagem: `${siteName} - ${alertType}`,
      criado_em: new Date()
    });

    // Determinar se é RED FLAG
    const isRedFlag = ['CRITICA'].includes(severity);
    const hasDelay = ['ALTA'].includes(severity);

    if (isRedFlag) {
      // Enviar RED FLAG imediatamente
      await this.emailService.sendRedFlagAlert({
        siteId,
        siteName,
        siteUrl,
        alertType,
        severity,
        message: `${siteName} está com problema: ${alertType}`,
        detectedAt: new Date(),
        metrics
      });

      // Enviar notificações adicionais
      await this.notificationService.sendWhatsApp(
        process.env.WHATSAPP_ADMIN,
        `🚨 RED FLAG: ${siteName} - ${alertType}`
      );

      await this.notificationService.sendSMS(
        process.env.SMS_ADMIN,
        `RED FLAG: ${siteName} - ${alertType}`
      );
    } else if (hasDelay) {
      // Aguardar 5 minutos para confirmar
      setTimeout(async () => {
        const recentAlert = await db.query.alerts.findFirst({
          where: eq(alerts.siteId, siteId)
        });

        if (recentAlert && !recentAlert.resolvido_em) {
          // Problema persiste, enviar RED FLAG
          await this.emailService.sendRedFlagAlert({
            siteId,
            siteName,
            siteUrl,
            alertType,
            severity,
            message: `${siteName} continua com problema: ${alertType}`,
            detectedAt: new Date(),
            metrics
          });
        }
      }, 5 * 60 * 1000); // 5 minutos
    }

    // Atualizar dashboard em tempo real
    await this.notificationService.broadcastToWebSocket({
      type: 'alert_created',
      alert: alert
    });
  }

  async handleRecovery(
    siteId: string,
    siteName: string,
    siteUrl: string,
    startTime: Date
  ): Promise<void> {
    const duration = this.calculateDuration(startTime, new Date());

    // Enviar email de recuperação
    await this.emailService.sendRecoveryEmail({
      siteId,
      siteName,
      siteUrl,
      alertType: 'Recovery',
      severity: 'MEDIA',
      message: `${siteName} se recuperou`,
      detectedAt: startTime
    }, duration);

    // Enviar notificação de recuperação
    await this.notificationService.sendPush(
      process.env.PUSH_ADMIN,
      `✅ ${siteName} se recuperou após ${duration}`
    );

    // Marcar alerta como resolvido
    await db.update(alerts)
      .set({ resolvido_em: new Date(), resolvido: true })
      .where(eq(alerts.siteId, siteId));
  }

  private calculateDuration(start: Date, end: Date): string {
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
}
```

---

## 7. Configuração do Banco de Dados

### 7.1 Tabela de Alertas Expandida

```sql
CREATE TABLE alertas (
  id UUID PRIMARY KEY,
  site_id UUID REFERENCES sites(id),
  tipo ENUM('offline', 'tempo_alto', 'erro_alto', 'ssl', 'quota', 'db_error', 'cache_error'),
  severidade ENUM('baixa', 'media', 'alta', 'critica'),
  mensagem TEXT NOT NULL,
  resolvido BOOLEAN DEFAULT false,
  criado_em TIMESTAMP DEFAULT NOW(),
  resolvido_em TIMESTAMP,
  email_enviado BOOLEAN DEFAULT false,
  email_enviado_em TIMESTAMP,
  whatsapp_enviado BOOLEAN DEFAULT false,
  sms_enviado BOOLEAN DEFAULT false,
  push_enviado BOOLEAN DEFAULT false,
  INDEX(site_id, criado_em),
  INDEX(severidade, resolvido)
);
```

### 7.2 Tabela de Histórico de Emails

```sql
CREATE TABLE email_log (
  id UUID PRIMARY KEY,
  alerta_id UUID REFERENCES alertas(id),
  destinatario VARCHAR(255),
  assunto VARCHAR(255),
  tipo ENUM('red_flag', 'alerta', 'recuperacao'),
  enviado_em TIMESTAMP DEFAULT NOW(),
  status ENUM('enviado', 'falha', 'bounce'),
  erro_mensagem TEXT,
  INDEX(alerta_id, enviado_em)
);
```

---

## 8. Testes

### 8.1 Teste de Email

```typescript
// Teste para verificar se o email é enviado corretamente
describe('EmailService - Red Flag', () => {
  it('deve enviar email com RED FLAG para instabilidade crítica', async () => {
    const emailService = new EmailService();
    
    await emailService.sendRedFlagAlert({
      siteId: 'teste-001',
      siteName: 'Movimento Mais Brasil',
      siteUrl: 'https://www.movimentomaisbrasil.org.br/',
      alertType: 'offline',
      severity: 'CRITICA',
      message: 'Site está offline',
      detectedAt: new Date(),
      metrics: {
        responseTime: 30000,
        httpCode: 0
      }
    });

    // Verificar se email foi enviado
    expect(emailService.transporter.sendMail).toHaveBeenCalled();
  });
});
```

---

## 9. Monitoramento de Entrega de Email

### 9.1 Webhook para Confirmação de Entrega

```typescript
// Receber confirmação de entrega do SendGrid
app.post('/webhooks/email-events', (req, res) => {
  const events = req.body;

  events.forEach(async (event) => {
    if (event.event === 'delivered') {
      await db.update(email_log)
        .set({ status: 'enviado' })
        .where(eq(email_log.id, event.sg_message_id));
    } else if (event.event === 'bounce') {
      await db.update(email_log)
        .set({ status: 'bounce', erro_mensagem: event.reason })
        .where(eq(email_log.id, event.sg_message_id));
    }
  });

  res.sendStatus(200);
});
```

---

## 10. Resumo de Implementação

| Item | Descrição |
|------|-----------|
| **Email Destinatário** | alessandro@pizzolatto.com |
| **Tipos de RED FLAG** | Site Offline, Tempo Alto, Taxa Erro Alta, SSL Expirado, DB Desconectado |
| **Delay para Alertas Altos** | 5-15 minutos (confirmar persistência) |
| **Canais Adicionais** | WhatsApp, SMS, Push Notification |
| **Templates** | 3 (Crítica, Alta, Recuperação) |
| **Serviço de Email** | SendGrid (recomendado) ou Gmail |
| **Logging** | Registrar todos os emails enviados |
| **Testes** | Testes unitários e de integração |

---

**Versão:** 1.0
**Data:** 15 de Dezembro de 2025
**Status:** Pronto para Implementação
