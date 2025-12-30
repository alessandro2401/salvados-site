# Configuração do Google Apps Script para Webhook

Este documento descreve como configurar o Google Apps Script para enviar notificações automáticas ao sistema Salvados quando a planilha do Google Sheets for modificada.

## Pré-requisitos

- Acesso de editor à planilha do Google Sheets
- Permissões para criar e executar Apps Scripts

## Passos de Configuração

### 1. Abrir o Editor de Apps Script

1. Abra a planilha do Google Sheets
2. Vá em **Extensões → Apps Script**
3. Um novo projeto será criado automaticamente

### 2. Adicionar o Código do Webhook

Cole o seguinte código no editor:

```javascript
// URL do webhook do sistema Salvados
const WEBHOOK_URL = 'https://salvados.administradoramutual.com.br/api/trpc/googleSheets.webhook';

/**
 * Função executada quando a planilha é editada
 */
function onEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const sheetName = sheet.getName();
    
    // Ignorar abas que não são de veículos
    const validSheets = [
      'Novos No Pátio',
      'Venda Autorizada',
      'Vendido e Não Recebido',
      'Vendido e Recebido',
      'Ocorrência',
      'Proibia a Venda'
    ];
    
    if (!validSheets.includes(sheetName)) {
      return;
    }
    
    const range = e.range;
    const row = range.getRow();
    const col = range.getColumn();
    const newValue = e.value;
    const oldValue = e.oldValue;
    
    // Preparar dados do webhook
    const payload = {
      sheetName: sheetName,
      action: oldValue === undefined ? 'insert' : 'update',
      rowData: {
        row: row,
        col: col,
        newValue: newValue,
        oldValue: oldValue
      }
    };
    
    // Enviar notificação para o webhook
    sendWebhook(payload);
    
  } catch (error) {
    console.error('Erro ao processar edição:', error);
  }
}

/**
 * Enviar dados para o webhook
 */
function sendWebhook(payload) {
  try {
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    
    if (responseCode !== 200) {
      console.error('Erro no webhook:', responseCode, response.getContentText());
    } else {
      console.log('Webhook enviado com sucesso');
    }
    
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
  }
}

/**
 * Função de teste manual
 */
function testWebhook() {
  const testPayload = {
    sheetName: 'Venda Autorizada',
    action: 'update',
    rowData: {
      row: 2,
      col: 1,
      newValue: 'ABC-1234',
      oldValue: 'XYZ-5678'
    }
  };
  
  sendWebhook(testPayload);
  console.log('Teste de webhook executado');
}
```

### 3. Configurar o Gatilho (Trigger)

1. No editor do Apps Script, clique no ícone de **relógio** (Gatilhos) na barra lateral esquerda
2. Clique em **+ Adicionar gatilho** no canto inferior direito
3. Configure o gatilho com as seguintes opções:
   - **Escolha qual função executar:** `onEdit`
   - **Escolha qual implantação deve ser executada:** `Head`
   - **Selecione a origem do evento:** `Da planilha`
   - **Selecione o tipo de evento:** `Ao editar`
4. Clique em **Salvar**

### 4. Autorizar o Script

1. Na primeira execução, o Google solicitará autorização
2. Clique em **Revisar permissões**
3. Selecione sua conta do Google
4. Clique em **Avançado** (se necessário)
5. Clique em **Ir para [nome do projeto] (não seguro)**
6. Clique em **Permitir**

### 5. Testar o Webhook

1. No editor do Apps Script, selecione a função `testWebhook` no menu suspenso
2. Clique no botão **Executar** (ícone de play)
3. Verifique os logs clicando em **Execuções** na barra lateral
4. Confirme que o webhook foi enviado com sucesso

## Funcionamento

- **Quando uma célula é editada:** O script detecta automaticamente a mudança e envia uma notificação para o sistema Salvados
- **Abas monitoradas:** Apenas as abas de veículos são monitoradas (Novos No Pátio, Venda Autorizada, etc.)
- **Dados enviados:** O webhook envia o nome da aba, a ação (insert/update) e os dados da linha modificada

## Solução de Problemas

### O webhook não está sendo enviado

1. Verifique se o gatilho foi configurado corretamente
2. Confirme que a URL do webhook está correta
3. Verifique os logs de execução no Apps Script

### Erro de autorização

1. Revogue as permissões antigas em https://myaccount.google.com/permissions
2. Execute o script novamente para reautorizar

### Webhook recebido mas não processado

1. Verifique os logs do servidor Salvados
2. Confirme que o formato do payload está correto
3. Teste manualmente com a função `testWebhook`

## Segurança

- O webhook é público, mas apenas aceita dados específicos
- Considere adicionar um token de autenticação no payload para maior segurança
- Monitore os logs de webhook no sistema Salvados

## Limitações

- O Apps Script tem limites de execução diária (veja [Quotas do Google Apps Script](https://developers.google.com/apps-script/guides/services/quotas))
- Edições em massa podem gerar múltiplas notificações
- O gatilho `onEdit` não é acionado por mudanças via API ou importação de dados

## Suporte

Para dúvidas ou problemas, consulte a documentação oficial:
- [Google Apps Script](https://developers.google.com/apps-script)
- [Triggers do Apps Script](https://developers.google.com/apps-script/guides/triggers)
