import { google } from 'googleapis';
import { InsertVehicle } from '../drizzle/schema';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '';

interface SheetRow {
  [key: string]: string | number | null;
}

/**
 * Obter cliente autenticado do Google Sheets
 */
async function getGoogleSheetsClient() {
  // Verificar se a chave de serviço está configurada
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  
  if (!serviceAccountKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY não configurada');
  }

  try {
    const credentials = JSON.parse(serviceAccountKey);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });
    
    return sheets;
  } catch (error) {
    console.error('[GoogleSheets] Erro ao autenticar:', error);
    throw new Error('Falha na autenticação com Google Sheets');
  }
}

/**
 * Ler dados de uma aba específica
 */
export async function readSheetData(sheetName: string): Promise<SheetRow[]> {
  try {
    const sheets = await getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`, // Ler todas as colunas de A até Z
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return [];
    }

    // A primeira linha contém os cabeçalhos
    const headers = rows[0].map(h => String(h).trim());
    const data: SheetRow[] = [];

    // Processar as linhas de dados
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowData: SheetRow = {};
      
      headers.forEach((header, index) => {
        rowData[header] = row[index] !== undefined ? row[index] : null;
      });
      
      data.push(rowData);
    }

    return data;
  } catch (error) {
    console.error(`[GoogleSheets] Erro ao ler aba "${sheetName}":`, error);
    throw error;
  }
}

/**
 * Converter linha do Google Sheets para formato de veículo
 */
function parseVehicleFromRow(row: SheetRow, status: string): Partial<InsertVehicle> | null {
  const placa = String(row['PLACA'] || row['Placa'] || '').trim();
  
  if (!placa) return null;

  // Extrair marca e modelo
  const marcaModelo = String(row['MARCA/MODELO'] || row['Marca/Modelo'] || row['MODELO'] || '');
  const [marca, ...modeloParts] = marcaModelo.split(' ');
  const modelo = modeloParts.join(' ');

  // Extrair ano
  const anoStr = String(row['ANO'] || row['Ano'] || '');
  const ano = parseInt(anoStr, 10);

  // Extrair tipo
  const tipoStr = String(row['TIPO'] || row['Tipo'] || '').toLowerCase();
  const tipo: "Sucata" | "Recuperável" = tipoStr.includes('sucata') ? 'Sucata' : 'Recuperável';

  // Extrair valor alcançado (se houver)
  let valorAlcancado: number | undefined;
  const valorAlcancadoStr = String(row['VALOR ALCANÇADO'] || row['Valor Alcançado'] || '');
  if (valorAlcancadoStr) {
    const cleaned = valorAlcancadoStr.replace(/[R$\s.]/g, '').replace(',', '');
    valorAlcancado = parseInt(cleaned, 10);
  }

  return {
    placa,
    marca: marca || 'N/A',
    modelo: modelo || marcaModelo,
    ano: isNaN(ano) ? 2020 : ano,
    tipo,
    status: status as any,
    valorAlcancado,
  };
}

/**
 * Importar veículos de todas as abas do Google Sheets
 */
export async function importAllSheetsData(): Promise<{
  novosNoPatio: Partial<InsertVehicle>[];
  vendaAutorizada: Partial<InsertVehicle>[];
  vendidoNaoRecebido: Partial<InsertVehicle>[];
  vendidoRecebido: Partial<InsertVehicle>[];
  ocorrencia: Partial<InsertVehicle>[];
  proibidaVenda: Partial<InsertVehicle>[];
}> {
  const sheets = [
    { name: 'Novos No Pátio', status: 'Novo no Pátio' },
    { name: 'Venda Autorizada', status: 'Venda Autorizada' },
    { name: 'Vendido e Não Recebido', status: 'Vendido e Não Recebido' },
    { name: 'Vendido e Recebido', status: 'Vendido e Recebido' },
    { name: 'Ocorrência', status: 'Ocorrência' },
    { name: 'Proibia a Venda', status: 'Proibida a Venda' },
  ];

  const result: any = {
    novosNoPatio: [],
    vendaAutorizada: [],
    vendidoNaoRecebido: [],
    vendidoRecebido: [],
    ocorrencia: [],
    proibidaVenda: [],
  };

  for (const sheet of sheets) {
    try {
      const rows = await readSheetData(sheet.name);
      const vehicles = rows
        .map(row => parseVehicleFromRow(row, sheet.status))
        .filter(v => v !== null);

      const key = sheet.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/á/g, 'a')
        .replace(/ã/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o');

      if (key.includes('novos')) result.novosNoPatio = vehicles;
      else if (key.includes('vendaautorizada')) result.vendaAutorizada = vehicles;
      else if (key.includes('vendidoenaorecebido')) result.vendidoNaoRecebido = vehicles;
      else if (key.includes('vendidoerecebido')) result.vendidoRecebido = vehicles;
      else if (key.includes('ocorrencia')) result.ocorrencia = vehicles;
      else if (key.includes('proibia')) result.proibidaVenda = vehicles;
    } catch (error) {
      console.warn(`[GoogleSheets] Erro ao processar aba "${sheet.name}":`, error);
    }
  }

  return result;
}
