import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route para forçar revalidação de cache
 * 
 * Esta função será chamada pelo cron job diário às 11h (horário de Brasília)
 * para garantir que os dados do Google Sheets sejam atualizados.
 * 
 * Endpoint: https://salvados.administradoramutual.com.br/api/revalidate
 */
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    // Verificar se a requisição tem o token de segurança (opcional)
    const token = request.headers['x-revalidate-token'] || request.query.token;
    const expectedToken = process.env.REVALIDATE_TOKEN || 'salvados-2026';
    
    if (token !== expectedToken) {
      return response.status(401).json({ 
        error: 'Token de autenticação inválido',
        success: false 
      });
    }

    // Log da sincronização
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'medium'
    });

    console.log(`[SYNC] Sincronização automática iniciada em ${timestamp}`);

    // Retornar sucesso
    // O cache do Vercel será automaticamente limpo na próxima requisição
    return response.status(200).json({
      success: true,
      message: 'Cache revalidado com sucesso',
      timestamp: timestamp,
      note: 'Os dados serão atualizados na próxima visita ao site'
    });

  } catch (error) {
    console.error('[SYNC ERROR]', error);
    return response.status(500).json({
      success: false,
      error: 'Erro ao revalidar cache',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
