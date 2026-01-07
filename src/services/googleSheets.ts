// Serviço para buscar dados do Google Sheets
// URL da planilha: https://docs.google.com/spreadsheets/d/1M6cez9KsP0KdvkYrcwITd4eMkA10KpYUmPxIvNGCmEI/edit

const SPREADSHEET_ID = '1M6cez9KsP0KdvkYrcwITd4eMkA10KpYUmPxIvNGCmEI';

// Mapeamento dos nomes das abas
export const SHEET_TABS = {
  RESUMO: 'Resumo',
  NOVOS_NO_PATIO: 'Novos No Pátio',
  VENDA_AUTORIZADA: 'Venda Autorizada',
  VENDIDO_NAO_RECEBIDO: 'Vendido e Não Recebido',
  VENDIDO_RECEBIDO: 'Vendido e Recebido',
  OCORRENCIA: 'Ocorrência',
  PROIBIDA_VENDA: 'Proibia a Venda',
};

// Interface simplificada para uso nos componentes
export interface Vehicle {
  dataEntrada: string;
  marca: string;
  modelo: string;
  placa: string;
  valorFipe: number;
  avaliacao: string;
  situacao: string;
  valorSugerido: number;
  valorVendido: number;
  valorRecebido: number;
  dias: number;
  aba: string;
}

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

// Função para converter VehicleData para Vehicle
function convertToVehicle(data: VehicleData, aba: string): Vehicle {
  return {
    dataEntrada: data.dataEntrada,
    marca: data.marca,
    modelo: data.modelo,
    placa: data.placa,
    valorFipe: data.fipe,
    avaliacao: data.avaliacao,
    situacao: data.situacao,
    valorSugerido: data.valorSugerido,
    valorVendido: data.vlrVendido,
    valorRecebido: data.vlRecebido,
    dias: data.dias,
    aba: aba,
  };
}

// Função para converter valor em formato brasileiro para número
function parseValorBR(valor: string): number {
  if (!valor || valor === '-' || valor === 'R$' || valor.trim() === '' || valor.includes('NADA')) return 0;
  
  // Remove "R$", espaços, pontos de milhar e caracteres especiais
  const cleanValue = valor
    .replace(/R\$/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();
  
  if (cleanValue === '' || cleanValue === '-') return 0;
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

// Função para converter data em formato brasileiro para ISO
function parseDataBR(data: string): string {
  if (!data || data === '-' || data.trim() === '' || data === '0') return '';
  
  // Se já estiver em formato ISO
  if (data.includes('-') && data.length === 10) return data;
  
  // Formato DD/MM/YYYY
  const parts = data.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  
  return '';
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

// Função para verificar se uma linha é válida (tem dados de veículo)
function isValidVehicleLine(fields: string[]): boolean {
  // Linha deve ter pelo menos 4 campos preenchidos (data, marca, modelo, placa)
  if (fields.length < 4) return false;
  
  const dataEntrada = fields[0] || '';
  const marca = fields[1] || '';
  const modelo = fields[2] || '';
  const placa = fields[3] || '';
  
  // Ignorar linhas vazias ou com "NADA", "SIM", "NÃO", cabeçalhos, etc.
  if (!dataEntrada || !marca || !modelo || !placa) return false;
  if (dataEntrada === 'DATA ENTRADA' || dataEntrada.includes('Agd')) return false;
  if (['SIM', 'NÃO', 'NADA', 'RECUPERÁVEL', 'SUCATA', 'OUTRO'].includes(dataEntrada)) return false;
  
  // Verificar se tem formato de data (DD/MM/YYYY)
  if (!dataEntrada.includes('/')) return false;
  
  return true;
}

// Função para buscar dados de uma aba específica
export async function fetchSheetData(tabName: string): Promise<VehicleData[]> {
  console.log(`[GoogleSheets] Buscando dados da aba: "${tabName}"`);
  try {
    // URL para exportar a aba como CSV
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    // Pular as primeiras 2 linhas (totais e cabeçalho) e começar dos dados
    const dataLines = lines.slice(2);
    
    const vehicles: VehicleData[] = [];
    let totalLines = 0;
    let validLines = 0;
    let rejectedLines = 0;
    
    for (const line of dataLines) {
      totalLines++;
      if (!line.trim()) continue;
      
      // Parse CSV
      const fields = parseCSVLine(line);
      
      // Verificar se é uma linha válida de veículo
      if (!isValidVehicleLine(fields)) {
        rejectedLines++;
        continue;
      }
      validLines++;
      
      const vehicle: VehicleData = {
        dataEntrada: parseDataBR(fields[0] || ''),
        marca: fields[1] || '',
        modelo: fields[2] || '',
        placa: fields[3] || '',
        fipe: parseValorBR(fields[4] || '0'),
        avaliacaoLeilao: fields[5] || '',
        situacao: fields[6] || '',
        avaliacao: fields[7] || '',
        percentual: parseFloat((fields[8] || '0').replace('%', '').replace(',', '.')) / 100,
        valorSugerido: parseValorBR(fields[9] || '0'),
        retorno: parseFloat((fields[10] || '0').replace('%', '').replace(',', '.')) / 100,
        vlrVendido: parseValorBR(fields[11] || '0'),
        retornoReal: parseFloat((fields[12] || '0').replace('%', '').replace(',', '.')) / 100,
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
    
    console.log(`[GoogleSheets] Aba "${tabName}": ${totalLines} linhas processadas, ${validLines} válidas, ${rejectedLines} rejeitadas, ${vehicles.length} veículos retornados`);
    return vehicles;
  } catch (error) {
    console.error(`Erro ao buscar dados da aba "${tabName}":`, error);
    throw error;
  }
}

// Função para buscar dados de todas as abas e retornar como Vehicle[]
export async function fetchAllSheets(): Promise<Vehicle[]> {
  try {
    const [
      novosNoPatio,
      vendaAutorizada,
      vendidoNaoRecebido,
      vendidoRecebido,
      ocorrencia,
      proibidaVenda,
    ] = await Promise.all([
      fetchSheetData(SHEET_TABS.NOVOS_NO_PATIO),
      fetchSheetData(SHEET_TABS.VENDA_AUTORIZADA),
      fetchSheetData(SHEET_TABS.VENDIDO_NAO_RECEBIDO),
      fetchSheetData(SHEET_TABS.VENDIDO_RECEBIDO),
      fetchSheetData(SHEET_TABS.OCORRENCIA),
      fetchSheetData(SHEET_TABS.PROIBIDA_VENDA),
    ]);
    
    // Consolidar todos os veículos
    const allVehicles: Vehicle[] = [
      ...novosNoPatio.map(v => convertToVehicle(v, 'Novos No Pátio')),
      ...vendaAutorizada.map(v => convertToVehicle(v, 'Venda Autorizada')),
      ...vendidoNaoRecebido.map(v => convertToVehicle(v, 'Vendido e Não Recebido')),
      ...vendidoRecebido.map(v => convertToVehicle(v, 'Vendido e Recebido')),
      ...ocorrencia.map(v => convertToVehicle(v, 'Ocorrências')),
      ...proibidaVenda.map(v => convertToVehicle(v, 'Proibida a Venda')),
    ];
    
    return allVehicles;
  } catch (error) {
    console.error('Erro ao buscar todas as abas:', error);
    throw error;
  }
}

// Função para calcular métricas do dashboard
export function calculateMetrics(vehicles: Vehicle[]) {
  const totalVeiculos = vehicles.length;
  
  const veiculosVendidos = vehicles.filter(v => 
    v.situacao.includes('VENDIDO') || v.aba.includes('Vendido')
  ).length;
  
  const novosNoPatio = vehicles.filter(v => 
    v.aba === 'Novos No Pátio'
  ).length;
  
  const ocorrencias = vehicles.filter(v => 
    v.aba === 'Ocorrências'
  ).length;
  
  const totalFipe = vehicles.reduce((sum, v) => sum + (v.valorFipe || 0), 0);
  const totalSugerido = vehicles.reduce((sum, v) => sum + (v.valorSugerido || 0), 0);
  const totalVendido = vehicles.reduce((sum, v) => sum + (v.valorVendido || 0), 0);
  const totalRecebido = vehicles.reduce((sum, v) => sum + (v.valorRecebido || 0), 0);
  
  const taxaRecuperacao = totalFipe > 0 ? (totalVendido / totalFipe) * 100 : 0;
  
  const diasArray = vehicles.filter(v => v.dias > 0).map(v => v.dias);
  const tempoMedio = diasArray.length > 0
    ? Math.round(diasArray.reduce((sum, d) => sum + d, 0) / diasArray.length)
    : 0;
  
  return {
    totalVeiculos,
    veiculosVendidos,
    novosNoPatio,
    ocorrencias,
    totalFipe,
    totalSugerido,
    totalVendido,
    totalRecebido,
    taxaRecuperacao,
    tempoMedio,
  };
}
