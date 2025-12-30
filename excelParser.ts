import * as XLSX from 'xlsx';
import { InsertVehicle } from '../drizzle/schema';

export interface ParsedVehicle {
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  tipo: "Sucata" | "Recuperável";
  valorAlcancado?: number; // Valor em centavos
}

/**
 * Parsear planilha Excel de leilão
 * Espera colunas: PLACA, MARCA/MODELO, ANO, TIPO, VALOR FIPE, VALOR SUGERIDO, VALOR ALCANÇADO
 */
export function parseAuctionExcel(buffer: Buffer): ParsedVehicle[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Converter para JSON
  const data: any[] = XLSX.utils.sheet_to_json(worksheet);
  
  const vehicles: ParsedVehicle[] = [];
  
  for (const row of data) {
    // Ignorar linhas vazias ou cabeçalhos extras
    if (!row['PLACA'] && !row['Placa'] && !row['placa']) continue;
    
    const placa = (row['PLACA'] || row['Placa'] || row['placa'] || '').toString().trim();
    if (!placa) continue;
    
    // Extrair marca e modelo
    const marcaModelo = (row['MARCA/MODELO'] || row['Marca/Modelo'] || row['MODELO'] || row['Modelo'] || '').toString();
    const [marca, ...modeloParts] = marcaModelo.split(' ');
    const modelo = modeloParts.join(' ');
    
    // Extrair ano
    const anoStr = (row['ANO'] || row['Ano'] || row['ano'] || '').toString();
    const ano = parseInt(anoStr, 10);
    
    // Extrair tipo
    const tipoStr = (row['TIPO'] || row['Tipo'] || row['tipo'] || '').toString().toLowerCase();
    const tipo: "Sucata" | "Recuperável" = tipoStr.includes('sucata') ? 'Sucata' : 'Recuperável';
    
    // Extrair valor alcançado (se houver)
    let valorAlcancado: number | undefined;
    const valorAlcancadoStr = (row['VALOR ALCANÇADO'] || row['Valor Alcançado'] || row['VALOR_ALCANCADO'] || '').toString();
    if (valorAlcancadoStr) {
      // Converter string de valor para centavos
      const cleaned = valorAlcancadoStr.replace(/[R$\s.]/g, '').replace(',', '');
      valorAlcancado = parseInt(cleaned, 10);
    }
    
    vehicles.push({
      placa,
      marca: marca || 'N/A',
      modelo: modelo || marcaModelo,
      ano: isNaN(ano) ? 2020 : ano,
      tipo,
      valorAlcancado,
    });
  }
  
  return vehicles;
}

/**
 * Validar se a planilha tem as colunas necessárias
 */
export function validateAuctionExcel(buffer: Buffer): { valid: boolean; error?: string } {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      return { valid: false, error: 'Planilha vazia' };
    }
    
    const firstRow = data[0];
    const hasPlaca = 'PLACA' in firstRow || 'Placa' in firstRow || 'placa' in firstRow;
    
    if (!hasPlaca) {
      return { valid: false, error: 'Coluna PLACA não encontrada' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: `Erro ao ler planilha: ${error}` };
  }
}
