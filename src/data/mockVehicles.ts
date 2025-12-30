// Dados mockados de veículos salvados para demonstração
export interface Vehicle {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  tipo: 'Sucata' | 'Recuperável';
  status: 'Novo no Pátio' | 'Em Avaliação' | 'Aguardando Leilão' | 'Leiloado' | 'Vendido';
  valorFipe: number; // em centavos
  valorSugerido: number; // em centavos
  valorVenda?: number; // em centavos
  dataEntrada: string; // ISO date
  dataVenda?: string; // ISO date
  observacoes?: string;
  comprador?: string;
  leiloeiro?: string;
  diasPatio: number;
}

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    placa: 'ABC-1234',
    marca: 'Volkswagen',
    modelo: 'Gol 1.0',
    ano: 2018,
    tipo: 'Recuperável',
    status: 'Vendido',
    valorFipe: 3500000, // R$ 35.000,00
    valorSugerido: 1400000, // R$ 14.000,00 (40%)
    valorVenda: 1550000, // R$ 15.500,00
    dataEntrada: '2025-11-15',
    dataVenda: '2025-12-10',
    observacoes: 'Colisão frontal, motor intacto',
    comprador: 'Auto Peças Silva Ltda',
    diasPatio: 25
  },
  {
    id: '2',
    placa: 'DEF-5678',
    marca: 'Fiat',
    modelo: 'Uno Vivace',
    ano: 2016,
    tipo: 'Sucata',
    status: 'Leiloado',
    valorFipe: 2800000, // R$ 28.000,00
    valorSugerido: 700000, // R$ 7.000,00 (25%)
    valorVenda: 750000, // R$ 7.500,00
    dataEntrada: '2025-11-20',
    dataVenda: '2025-12-18',
    observacoes: 'Perda total por incêndio',
    leiloeiro: 'Leilões Rápidos S.A.',
    comprador: 'Sucatas Recife',
    diasPatio: 28
  },
  {
    id: '3',
    placa: 'GHI-9012',
    marca: 'Chevrolet',
    modelo: 'Onix 1.4 LT',
    ano: 2020,
    tipo: 'Recuperável',
    status: 'Aguardando Leilão',
    valorFipe: 5200000, // R$ 52.000,00
    valorSugerido: 2080000, // R$ 20.800,00 (40%)
    dataEntrada: '2025-12-05',
    observacoes: 'Colisão lateral direita, airbags acionados',
    diasPatio: 25
  },
  {
    id: '4',
    placa: 'JKL-3456',
    marca: 'Hyundai',
    modelo: 'HB20 1.6',
    ano: 2019,
    tipo: 'Recuperável',
    status: 'Em Avaliação',
    valorFipe: 4800000, // R$ 48.000,00
    valorSugerido: 1920000, // R$ 19.200,00 (40%)
    dataEntrada: '2025-12-20',
    observacoes: 'Alagamento, necessita revisão elétrica completa',
    diasPatio: 10
  },
  {
    id: '5',
    placa: 'MNO-7890',
    marca: 'Renault',
    modelo: 'Sandero 1.0',
    ano: 2017,
    tipo: 'Sucata',
    status: 'Novo no Pátio',
    valorFipe: 3200000, // R$ 32.000,00
    valorSugerido: 800000, // R$ 8.000,00 (25%)
    dataEntrada: '2025-12-28',
    observacoes: 'Capotamento, estrutura comprometida',
    diasPatio: 2
  },
  {
    id: '6',
    placa: 'PQR-2345',
    marca: 'Ford',
    modelo: 'Ka SE 1.0',
    ano: 2021,
    tipo: 'Recuperável',
    status: 'Vendido',
    valorFipe: 4500000, // R$ 45.000,00
    valorSugerido: 1800000, // R$ 18.000,00 (40%)
    valorVenda: 1950000, // R$ 19.500,00
    dataEntrada: '2025-10-15',
    dataVenda: '2025-11-30',
    observacoes: 'Colisão traseira leve',
    comprador: 'Funilaria Central',
    diasPatio: 46
  },
  {
    id: '7',
    placa: 'STU-6789',
    marca: 'Toyota',
    modelo: 'Corolla 2.0 XEi',
    ano: 2022,
    tipo: 'Recuperável',
    status: 'Em Avaliação',
    valorFipe: 12500000, // R$ 125.000,00
    valorSugerido: 5000000, // R$ 50.000,00 (40%)
    dataEntrada: '2025-12-22',
    observacoes: 'Roubo recuperado, sem avarias aparentes',
    diasPatio: 8
  },
  {
    id: '8',
    placa: 'VWX-0123',
    marca: 'Honda',
    modelo: 'Civic LXS 1.8',
    ano: 2015,
    tipo: 'Sucata',
    status: 'Leiloado',
    valorFipe: 5800000, // R$ 58.000,00
    valorSugerido: 1450000, // R$ 14.500,00 (25%)
    valorVenda: 1600000, // R$ 16.000,00
    dataEntrada: '2025-11-01',
    dataVenda: '2025-12-15',
    observacoes: 'Alagamento severo, perda total',
    leiloeiro: 'Mega Leilões',
    comprador: 'Desmanche SP',
    diasPatio: 44
  },
  {
    id: '9',
    placa: 'YZA-4567',
    marca: 'Nissan',
    modelo: 'March 1.6 SV',
    ano: 2019,
    tipo: 'Recuperável',
    status: 'Aguardando Leilão',
    valorFipe: 4200000, // R$ 42.000,00
    valorSugerido: 1680000, // R$ 16.800,00 (40%)
    dataEntrada: '2025-12-10',
    observacoes: 'Colisão múltipla, recuperável com investimento',
    diasPatio: 20
  },
  {
    id: '10',
    placa: 'BCD-8901',
    marca: 'Jeep',
    modelo: 'Renegade Sport 1.8',
    ano: 2020,
    tipo: 'Recuperável',
    status: 'Novo no Pátio',
    valorFipe: 8500000, // R$ 85.000,00
    valorSugerido: 3400000, // R$ 34.000,00 (40%)
    dataEntrada: '2025-12-29',
    observacoes: 'Colisão frontal, airbags acionados',
    diasPatio: 1
  },
  {
    id: '11',
    placa: 'EFG-2345',
    marca: 'Volkswagen',
    modelo: 'Polo 1.6 MSI',
    ano: 2018,
    tipo: 'Sucata',
    status: 'Vendido',
    valorFipe: 4600000, // R$ 46.000,00
    valorSugerido: 1150000, // R$ 11.500,00 (25%)
    valorVenda: 1200000, // R$ 12.000,00
    dataEntrada: '2025-10-20',
    dataVenda: '2025-12-05',
    observacoes: 'Incêndio no motor',
    comprador: 'Peças Premium',
    diasPatio: 46
  },
  {
    id: '12',
    placa: 'HIJ-6789',
    marca: 'Chevrolet',
    modelo: 'Prisma 1.4 LT',
    ano: 2017,
    tipo: 'Recuperável',
    status: 'Em Avaliação',
    valorFipe: 3900000, // R$ 39.000,00
    valorSugerido: 1560000, // R$ 15.600,00 (40%)
    dataEntrada: '2025-12-18',
    observacoes: 'Colisão traseira, porta-malas comprometido',
    diasPatio: 12
  }
];

// Função para calcular estatísticas
export function calculateStats(vehicles: Vehicle[]) {
  const total = vehicles.length;
  const porTipo = {
    sucata: vehicles.filter(v => v.tipo === 'Sucata').length,
    recuperavel: vehicles.filter(v => v.tipo === 'Recuperável').length
  };
  const porStatus = {
    novoNoPatio: vehicles.filter(v => v.status === 'Novo no Pátio').length,
    emAvaliacao: vehicles.filter(v => v.status === 'Em Avaliação').length,
    aguardandoLeilao: vehicles.filter(v => v.status === 'Aguardando Leilão').length,
    leiloado: vehicles.filter(v => v.status === 'Leiloado').length,
    vendido: vehicles.filter(v => v.status === 'Vendido').length
  };
  
  const vendidos = vehicles.filter(v => v.valorVenda);
  const valorTotalFipe = vehicles.reduce((sum, v) => sum + v.valorFipe, 0);
  const valorTotalSugerido = vehicles.reduce((sum, v) => sum + v.valorSugerido, 0);
  const valorTotalVendas = vendidos.reduce((sum, v) => sum + (v.valorVenda || 0), 0);
  
  const mediaDiasPatio = Math.round(
    vehicles.reduce((sum, v) => sum + v.diasPatio, 0) / total
  );
  
  const taxaRecuperacao = vendidos.length > 0
    ? (valorTotalVendas / vendidos.reduce((sum, v) => sum + v.valorSugerido, 0)) * 100
    : 0;

  return {
    total,
    porTipo,
    porStatus,
    valorTotalFipe,
    valorTotalSugerido,
    valorTotalVendas,
    mediaDiasPatio,
    taxaRecuperacao,
    totalVendidos: vendidos.length
  };
}

// Função para formatar moeda
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100);
}
