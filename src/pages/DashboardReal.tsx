import { useEffect, useState } from 'react';
import { fetchAllSheets, calculateDashboardMetrics, VehicleData } from '../services/googleSheets';

interface DashboardMetrics {
  totalVeiculos: number;
  valorTotalFipe: number;
  valorTotalSugerido: number;
  valorTotalVendido: number;
  valorTotalRecebido: number;
  veiculosVendidos: number;
  taxaRecuperacao: number;
  tempoMedio: number;
  novosNoPatio: number;
  vendaAutorizada: number;
  vendidoNaoRecebido: number;
  vendidoRecebido: number;
  ocorrencias: number;
  proibidaVenda: number;
}

export default function DashboardReal() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [ultimosVeiculos, setUltimosVeiculos] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const allData = await fetchAllSheets();
      const calculatedMetrics = calculateDashboardMetrics(allData);
      
      setMetrics(calculatedMetrics);
      
      // Pegar os 10 últimos veículos do resumo (ordenados por data de entrada)
      const sorted = [...allData.resumo]
        .filter(v => v.dataEntrada)
        .sort((a, b) => {
          return new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime();
        });
      setUltimosVeiculos(sorted.slice(0, 10));
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados da planilha. Verifique a conexão.');
      setLoading(false);
    }
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando dados da planilha...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto mt-8">
        <h3 className="text-red-800 font-semibold mb-2">Erro ao Carregar Dados</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Card de Status - Google Sheets */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Google Sheets Conectado</p>
            <p className="text-sm text-gray-500">Última sincronização: {new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition border border-yellow-300 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Sincronizar
        </button>
      </div>

      {/* KPIs Pequenos - Grid 4 colunas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Veículos */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 relative">
          <div className="absolute top-4 right-4">
            <svg className="w-5 h-5 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.totalVeiculos}</p>
          <p className="text-sm text-gray-600 mt-1">Total de Veículos</p>
        </div>

        {/* Vendidos */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 relative">
          <div className="absolute top-4 right-4">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.veiculosVendidos}</p>
          <p className="text-sm text-gray-600 mt-1">Veículos Vendidos</p>
        </div>

        {/* Novos no Pátio */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 relative">
          <div className="absolute top-4 right-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.novosNoPatio}</p>
          <p className="text-sm text-gray-600 mt-1">Novos no Pátio</p>
        </div>

        {/* Em Manutenção / Ocorrências */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 relative">
          <div className="absolute top-4 right-4">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.ocorrencias}</p>
          <p className="text-sm text-gray-600 mt-1">Ocorrências</p>
        </div>
      </div>

      {/* Cards Financeiros - Grid 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Receita Total (Valor Vendido) */}
        <div className="bg-blue-50 rounded-lg shadow-sm p-6 border border-blue-100 relative">
          <div className="absolute top-4 right-4">
            <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-700 font-medium mb-2">Receita Total</p>
          <p className="text-3xl font-bold text-teal-800">{formatCurrency(metrics.valorTotalVendido)}</p>
          <p className="text-xs text-gray-600 mt-2">Total vendido no período</p>
        </div>

        {/* Valor Recebido */}
        <div className="bg-green-50 rounded-lg shadow-sm p-6 border border-green-100 relative">
          <div className="absolute top-4 right-4">
            <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-sm text-gray-700 font-medium mb-2">Valor Recebido</p>
          <p className="text-3xl font-bold text-green-800">{formatCurrency(metrics.valorTotalRecebido)}</p>
          <p className="text-xs text-gray-600 mt-2">Taxa de recuperação: {metrics.taxaRecuperacao.toFixed(1)}%</p>
        </div>
      </div>

      {/* Totais Acumulados */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Totais Acumulados</h2>
          <div className="border-2 border-dashed border-yellow-400 rounded-lg px-4 py-2 bg-yellow-50">
            <span className="text-sm font-medium text-gray-900">{new Date().getFullYear()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Total FIPE */}
          <div className="bg-blue-50 rounded-lg shadow-sm p-6 border border-blue-100 relative">
            <div className="absolute top-4 right-4">
              <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 font-medium mb-2">Total FIPE {new Date().getFullYear()}</p>
            <p className="text-3xl font-bold text-teal-800">{formatCurrency(metrics.valorTotalFipe)}</p>
            <p className="text-xs text-gray-600 mt-2">Valor de referência da tabela FIPE</p>
          </div>

          {/* Total Sugerido */}
          <div className="bg-green-50 rounded-lg shadow-sm p-6 border border-green-100 relative">
            <div className="absolute top-4 right-4">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 font-medium mb-2">Total Sugerido {new Date().getFullYear()}</p>
            <p className="text-3xl font-bold text-green-800">{formatCurrency(metrics.valorTotalSugerido)}</p>
            <p className="text-xs text-gray-600 mt-2">Valor sugerido para venda</p>
          </div>
        </div>
      </div>

      {/* Campo de Busca com borda tracejada */}
      <div className="border-2 border-dashed border-orange-400 rounded-lg p-1 bg-white">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por placa, marca ou modelo..."
            className="block w-full pl-10 pr-3 py-3 border-0 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
        </div>
      </div>

      {/* Últimos Veículos - Cards Horizontais */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Últimos Veículos Adicionados</h2>
          <span className="text-sm text-gray-600">{ultimosVeiculos.length} veículos encontrados</span>
        </div>

        <div className="space-y-3">
          {ultimosVeiculos.map((veiculo, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Placa e Status */}
                <div className="lg:col-span-2">
                  <p className="text-lg font-bold text-gray-900">{veiculo.placa}</p>
                  <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
                    veiculo.situacao.includes('VENDIDO RECEBIDO') ? 'bg-green-100 text-green-800' :
                    veiculo.situacao.includes('VENDIDO') ? 'bg-blue-100 text-blue-800' :
                    veiculo.situacao.includes('PROIBIDO') ? 'bg-red-100 text-red-800' :
                    veiculo.situacao.includes('VENDA AUTORIZADA') ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {veiculo.situacao.includes('VENDIDO RECEBIDO') ? 'Vendido' :
                     veiculo.situacao.includes('PROIBIDO') ? 'Proibido' :
                     veiculo.situacao.includes('VENDA AUTORIZADA') ? 'Autorizado' : 'Novo'}
                  </span>
                </div>

                {/* Informações do Veículo */}
                <div className="lg:col-span-3">
                  <p className="font-semibold text-gray-900">{veiculo.marca} {veiculo.modelo}</p>
                  <p className="text-sm text-gray-600 mt-1">Avaliação: {veiculo.avaliacao}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(veiculo.dataEntrada)}
                  </p>
                </div>

                {/* Métricas Financeiras */}
                <div className="lg:col-span-5 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Valor FIPE</p>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(veiculo.fipe)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Valor Sugerido</p>
                    <p className="text-sm font-bold text-teal-700">{formatCurrency(veiculo.valorSugerido)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Valor Vendido</p>
                    <p className="text-sm font-bold text-green-700">{veiculo.vlrVendido > 0 ? formatCurrency(veiculo.vlrVendido) : '-'}</p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="lg:col-span-2 flex gap-2 justify-end">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition">
                    Docs
                  </button>
                  <button className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition">
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
