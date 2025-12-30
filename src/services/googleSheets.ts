// Serviço para buscar dados do Google Sheets
// URL da planilha: https://docs.google.com/spreadsheets/d/1M6cez9KsP0KdvkYrcwITd4eMkA10KpYUmPxIvNGCmEI/edit

const SPREADSHEET_ID = '1M6cez9KsP0KdvkYrcwITd4eMkA10KpYUmPxIvNGCmEI';

// Mapeamento dos nomes das abas para seus GIDs
export const SHEET_TABS = {
  RESUMO: 'Resumo',
  NOVOS_NO_PATIO: 'Novos No Pátio',
  VENDA_AUTORIZADA: '1 Venda Autorizada',
  VENDIDO_NAO_RECEBIDO: '2 Vendido e Não Recebido',
  VENDIDO_RECEBIDO: 'Vendido e Recebido',
  OCORRENCIA: 'Ocorrência',
  PROIBIDA_VENDA: '10 Proibia a Venda',
};

export interface VehicleData {
  dataEntrada: string;
  marca: string;
  modelo: string;
  placa: string;
  fipe: number;
  avaliacaoLeilao: string;
  situacao: string;
  avaliacao: string;
  percentual: number;
  valorSugerido: number;
  retorno: number;
  vlrVendido: number;
  retornoReal: number;
  liberado: string;
  atpvBaixa: string;
  observacao: string;
  dataAtpv: string;
  dataVenda: string;
  dias: number;
  valorPrevisto: number;
  vlRecebido: number;
  dataRecebido: string;
  diasRecebimento?: number;
}

// Função para converter valor em formato brasileiro para número
function parseValorBR(valor: string): number {
  if (!valor || valor === '-' || valor === 'R$' || valor === 'R$ -') return 0;
  
  // Remove "R$", espaços e pontos de milhar, substitui vírgula por ponto
  const cleanValue = valor
    .replace(/R\$/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

// Função para converter data em formato brasileiro para ISO
function parseDataBR(data: string): string {
  if (!data || data === '-') return '';
  
  // Se já estiver em formato ISO
  if (data.includes('-') && data.length === 10) return data;
  
  // Formato DD/MM/YYYY
  const parts = data.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  
  return '';
}

// Função para buscar dados de uma aba específica
export async function fetchSheetData(tabName: string): Promise<VehicleData[]> {
  try {
    // URL para exportar a aba como CSV
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    // Pular a primeira linha (cabeçalho)
    const dataLines = lines.slice(1).filter(line => line.trim() !== '');
    
    const vehicles: VehicleData[] = [];
    
    for (const line of dataLines) {
      // Parse CSV (considerando campos entre aspas)
      const fields = parseCSVLine(line);
      
      // Ignorar linhas vazias ou inválidas
      if (fields.length < 10 || !fields[0] || fields[0] === 'DATA ENTRADA') continue;
      
      const vehicle: VehicleData = {
        dataEntrada: parseDataBR(fields[0] || ''),
        marca: fields[1] || '',
        modelo: fields[2] || '',
        placa: fields[3] || '',
        fipe: parseValorBR(fields[4] || '0'),
        avaliacaoLeilao: fields[5] || '',
        situacao: fields[6] || '',
        avaliacao: fields[7] || '',
        percentual: parseFloat(fields[8] || '0'),
        valorSugerido: parseValorBR(fields[9] || '0'),
        retorno: parseFloat(fields[10] || '0'),
        vlrVendido: parseValorBR(fields[11] || '0'),
        retornoReal: parseFloat(fields[12] || '0'),
        liberado: fields[13] || '',
        atpvBaixa: fields[14] || '',
        observacao: fields[15] || '',
        dataAtpv: parseDataBR(fields[16] || ''),
        dataVenda: parseDataBR(fields[17] || ''),
        dias: parseInt(fields[18] || '0'),
        valorPrevisto: parseValorBR(fields[19] || '0'),
        vlRecebido: parseValorBR(fields[20] || '0'),
        dataRecebido: parseDataBR(fields[21] || ''),
        diasRecebimento: fields[22] ? parseInt(fields[22]) : undefined,
      };
      
      vehicles.push(vehicle);
    }
    
    return vehicles;
  } catch (error) {
    console.error(`Erro ao buscar dados da aba "${tabName}":`, error);
    throw error;
  }
}

// Função auxiliar para fazer parse de linha CSV considerando campos entre aspas
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      fields.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  // Adicionar o último campo
  fields.push(currentField.trim());
  
  return fields;
}

// Função para buscar dados de todas as abas
export async function fetchAllSheets(): Promise<{
  resumo: VehicleData[];
  novosNoPatio: VehicleData[];
  vendaAutorizada: VehicleData[];
  vendidoNaoRecebido: VehicleData[];
  vendidoRecebido: VehicleData[];
  ocorrencia: VehicleData[];
  proibidaVenda: VehicleData[];
}> {
  try {
    const [
      resumo,
      novosNoPatio,
      vendaAutorizada,
      vendidoNaoRecebido,
      vendidoRecebido,
      ocorrencia,
      proibidaVenda,
    ] = await Promise.all([
      fetchSheetData(SHEET_TABS.RESUMO),
      fetchSheetData(SHEET_TABS.NOVOS_NO_PATIO),
      fetchSheetData(SHEET_TABS.VENDA_AUTORIZADA),
      fetchSheetData(SHEET_TABS.VENDIDO_NAO_RECEBIDO),
      fetchSheetData(SHEET_TABS.VENDIDO_RECEBIDO),
      fetchSheetData(SHEET_TABS.OCORRENCIA),
      fetchSheetData(SHEET_TABS.PROIBIDA_VENDA),
    ]);
    
    return {
      resumo,
      novosNoPatio,
      vendaAutorizada,
      vendidoNaoRecebido,
      vendidoRecebido,
      ocorrencia,
      proibidaVenda,
    };
  } catch (error) {
    console.error('Erro ao buscar todas as abas:', error);
    throw error;
  }
}

// Função para calcular métricas do dashboard
export function calculateDashboardMetrics(allData: {
  resumo: VehicleData[];
  novosNoPatio: VehicleData[];
  vendaAutorizada: VehicleData[];
  vendidoNaoRecebido: VehicleData[];
  vendidoRecebido: VehicleData[];
  ocorrencia: VehicleData[];
  proibidaVenda: VehicleData[];
}) {
  const totalVeiculos = allData.resumo.length;
  
  const valorTotalFipe = allData.resumo.reduce((sum, v) => sum + v.fipe, 0);
  const valorTotalSugerido = allData.resumo.reduce((sum, v) => sum + v.valorSugerido, 0);
  const valorTotalVendido = allData.resumo.reduce((sum, v) => sum + v.vlrVendido, 0);
  const valorTotalRecebido = allData.resumo.reduce((sum, v) => sum + v.vlRecebido, 0);
  
  const veiculosVendidos = allData.vendidoNaoRecebido.length + allData.vendidoRecebido.length;
  const taxaRecuperacao = valorTotalFipe > 0 ? (valorTotalVendido / valorTotalFipe) * 100 : 0;
  
  const diasNoPatioArray = allData.resumo
    .filter(v => v.dias > 0)
    .map(v => v.dias);
  const tempoMedio = diasNoPatioArray.length > 0
    ? Math.round(diasNoPatioArray.reduce((sum, d) => sum + d, 0) / diasNoPatioArray.length)
    : 0;
  
  return {
    totalVeiculos,
    valorTotalFipe,
    valorTotalSugerido,
    valorTotalVendido,
    valorTotalRecebido,
    veiculosVendidos,
    taxaRecuperacao,
    tempoMedio,
    novosNoPatio: allData.novosNoPatio.length,
    vendaAutorizada: allData.vendaAutorizada.length,
    vendidoNaoRecebido: allData.vendidoNaoRecebido.length,
    vendidoRecebido: allData.vendidoRecebido.length,
    ocorrencias: allData.ocorrencia.length,
    proibidaVenda: allData.proibidaVenda.length,
  };
}
