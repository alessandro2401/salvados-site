# Configuração de Variáveis de Ambiente

Este documento descreve as variáveis de ambiente necessárias para o funcionamento completo do Sistema Salvados.

## Variáveis Pré-Configuradas (Automáticas)

As seguintes variáveis são configuradas automaticamente pela plataforma Manus e não precisam de configuração manual:

- `DATABASE_URL`: String de conexão do banco de dados PostgreSQL
- `JWT_SECRET`: Segredo para assinatura de tokens JWT
- `VITE_APP_ID`: ID da aplicação no sistema OAuth
- `OAUTH_SERVER_URL`: URL do servidor OAuth
- `VITE_OAUTH_PORTAL_URL`: URL do portal de login
- `OWNER_OPEN_ID`, `OWNER_NAME`: Informações do proprietário
- `VITE_APP_TITLE`: Título da aplicação
- `VITE_APP_LOGO`: Logo da aplicação

## Variáveis Opcionais (Configuração Manual)

### 1. Integração com Google Sheets

Para ativar a sincronização automática com o Google Sheets, configure:

#### `GOOGLE_SERVICE_ACCOUNT_KEY`

**Descrição:** Chave JSON da conta de serviço do Google Cloud para acesso à API do Google Sheets.

**Como obter:**

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Sheets API**:
   - Navegue para "APIs e Serviços" > "Biblioteca"
   - Pesquise por "Google Sheets API"
   - Clique em "Ativar"
4. Crie uma Conta de Serviço:
   - Navegue para "APIs e Serviços" > "Credenciais"
   - Clique em "Criar Credenciais" > "Conta de Serviço"
   - Preencha os dados e clique em "Criar"
5. Gere a chave JSON:
   - Na lista de contas de serviço, clique na conta criada
   - Vá para a aba "Chaves"
   - Clique em "Adicionar Chave" > "Criar nova chave"
   - Selecione "JSON" e clique em "Criar"
   - O arquivo JSON será baixado automaticamente
6. **Importante:** Compartilhe a planilha do Google Sheets com o email da conta de serviço (encontrado no arquivo JSON, campo `client_email`)

**Formato do valor:**

```json
{
  "type": "service_account",
  "project_id": "seu-projeto-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "nome@projeto.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

**Como configurar no Vercel:**

1. Acesse o painel de Secrets no Management UI do sistema
2. Adicione uma nova variável com a chave `GOOGLE_SERVICE_ACCOUNT_KEY`
3. Cole o conteúdo completo do arquivo JSON como valor
4. Salve a configuração

#### `GOOGLE_SHEETS_ID`

**Descrição:** ID da planilha do Google Sheets a ser sincronizada.

**Como obter:**

O ID da planilha está na URL do Google Sheets:

```
https://docs.google.com/spreadsheets/d/[GOOGLE_SHEETS_ID]/edit
```

Por exemplo, para a URL:
```
https://docs.google.com/spreadsheets/d/1M6cez9KsP0KdvkYrcwITd4eMkA10KpYUmPxIvNGCmEI/edit
```

O ID é: `1M6cez9KsP0KdvkYrcwITd4eMkA10KpYUmPxIvNGCmEI`

**Como configurar no Vercel:**

1. Acesse o painel de Secrets no Management UI
2. Adicione uma nova variável com a chave `GOOGLE_SHEETS_ID`
3. Cole o ID da planilha como valor
4. Salve a configuração

### 2. Percentuais de Cálculo FIPE (Opcional)

Por padrão, o sistema utiliza os seguintes percentuais para cálculo do valor esperado de retorno:

- **Veículos Sucata:** 25% do valor FIPE
- **Veículos Recuperáveis:** 40% do valor FIPE

Para personalizar esses valores, configure:

#### `FIPE_SUCATA_PERCENTUAL`

**Descrição:** Percentual do valor FIPE para veículos do tipo Sucata.

**Valor padrão:** `0.25` (25%)

**Formato:** Número decimal entre 0 e 1

**Exemplo:** Para 30%, use `0.30`

#### `FIPE_RECUPERAVEL_PERCENTUAL`

**Descrição:** Percentual do valor FIPE para veículos do tipo Recuperável.

**Valor padrão:** `0.40` (40%)

**Formato:** Número decimal entre 0 e 1

**Exemplo:** Para 45%, use `0.45`

**Como configurar no Vercel:**

1. Acesse o painel de Secrets no Management UI
2. Adicione as variáveis com as chaves `FIPE_SUCATA_PERCENTUAL` e/ou `FIPE_RECUPERAVEL_PERCENTUAL`
3. Insira os valores desejados
4. Salve a configuração

## Webhook do Google Apps Script

Para ativar a sincronização automática quando a planilha do Google Sheets for modificada, siga as instruções do arquivo `docs/google-apps-script-webhook.md`.

## Verificação da Configuração

Após configurar as variáveis de ambiente:

1. Reinicie o servidor de desenvolvimento (se estiver em ambiente local)
2. Acesse a página de Importação do Google Sheets (`/import-sheets`)
3. Teste a importação de dados
4. Verifique se as notificações estão funcionando corretamente

## Suporte

Para dúvidas ou problemas na configuração, consulte a documentação técnica ou entre em contato com o suporte.
